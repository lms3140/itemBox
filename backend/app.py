from flask import Flask, send_from_directory, request, Response,jsonify,g
from flask_cors import CORS
from db import db
from models import User,Item,Detail
import os
import sqlite3
from datetime import datetime
from flask_jwt_extended import JWTManager,create_access_token, jwt_required,get_jwt_identity
from dotenv import load_dotenv
import bcrypt
from datetime import timedelta


app = Flask(__name__, static_folder="../itemBox-project/dist")
CORS(app,origins=["http://localhost:5173"])

load_dotenv()  # .env 파일 읽기

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)



db.init_app(app)
# build 파일
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder,"index.html")

# build 파일2 js 파일을 서빙
@app.route("/assets/<path:filename>")
def serve_assets(filename):
    return send_from_directory(os.path.join(app.static_folder,"assets"),filename)

# [GET] /api/example JSON 형식의 응답 제공 예시
@app.route("/api/example", methods=["GET"])
def example_get():
    return jsonify({"message":"example"}),200


#################### Login 작업 ###########################

# [POST] /login 로그인
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_id = data.get("id")
    password = data.get("password")

    user = User.query.filter_by(id=user_id).first()

    
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "로그인 실패"}), 401

    token = create_access_token(identity=user.id)
    return jsonify(access_token=token, id=user.id, nickname=user.nickname), 200

# 기능만 남겨둠. 회원가입은 없음-
# # [POST] /register 회원가입
# @app.route("/register", methods=["POST"])
# def register():
#     data = request.get_json()
#     user_id = data.get("id")
#     password = data.get("password")
#     nickname = data.get("nickname")

#     # 간단한 유효성 검사
#     if not user_id or not password or not nickname:
#         return jsonify({"error": "모든 항목을 입력해주세요."}), 400

#     # 이미 존재하는지 확인
#     if User.query.filter_by(id=user_id).first():
#         return jsonify({"error": "이미 존재하는 아이디입니다."}), 409

#     # 신규 유저 생성
#     new_user = User(id=user_id, password=password, nickname=nickname)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({"msg": "회원가입 성공"}), 201


#################### Main 페이지 작업 ######################

# [GET] /api/main/grid-rows 물품 정보가 담긴 배열 보내기 
@app.route("/api/main/grid-rows", methods=["GET"])
@jwt_required()
def get_main_grid_data():
    try:
        user_id = get_jwt_identity()

        # created_by가 현재 유저인 아이템만 조회
        items = Item.query.filter_by(created_by=user_id).all()
        result = [item.to_dict() for item in items]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "불러오는 중 오류 발생"}), 500

# [POST] /api/main/grid-row/delete 삭제
@app.route("/api/main/grid-row/delete",methods=["POST"])
@jwt_required()
def del_main_grid_data():
    data = request.get_json()
    try:
        item_id = data.get("id")
        item = Item.query.get(item_id)

        if not item:
            return jsonify({"error":"존재하지 않는 항목."})
        
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message":"Data remove successfully"}),200
    except Exception as e:
        print("DB오류",e)
        return jsonify({"error":"삭제중 오류발생"}),500

# [POST] /api/main/grid-row/add 등록
@app.route("/api/main/grid-row/add",methods=["POST"])
@jwt_required()
def insert_main_grid_data():
    data = request.get_json()
    user_id = get_jwt_identity()
    if not data:
        return jsonify({"error":"NoData provided-_-"}),400

    try:
        item = Item(
            id=data["id"],
            name=data["name"],
            price=data["price"],
            category=data["category"],
            category_price=data["category_price"],
            wholesale_price=data["wholesale_price"],
            fee=data["fee"],
            purchase_quantity=data["purchase_quantity"],
            sold_quantity=data["sold_quantity"],
            release_date=data["release_date"],
            purchase_date=data["purchase_date"],
            sales_type=data["sales_type"],
            etc=data["etc"],
            created_by=user_id,  # 추후 토큰
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # 현재 시각을 넣어야함. 나중에.
        )

        db.session.add(item)
        db.session.commit()

        return jsonify({"message": "Data inserted successfully", "data": item.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"what the"}),500

@app.route("/api/main/grid-data/update", methods=["POST"])
@jwt_required()
def update_main_grid_data():
    data = request.get_json()
    if not data or not data.get("id"):
        return jsonify({"error": "ID 누락 또는 데이터 없음"}), 400

    try:
        item = Item.query.get(data["id"])
        if not item:
            return jsonify({"error": "해당 ID의 데이터 없음"}), 404

        # 필드 업데이트
        item.name = data["name"]
        item.price = data["price"]
        item.category = data["category"]
        item.category_price = data["category_price"]
        item.wholesale_price = data["wholesale_price"]
        item.fee = data["fee"]
        item.purchase_quantity = data["purchase_quantity"]
        item.sold_quantity = data["sold_quantity"]
        item.release_date = data["release_date"]
        item.purchase_date = data["purchase_date"]
        item.sales_type = data["sales_type"]
        item.etc = data["etc"]

        db.session.commit()

        return jsonify({"message": "Update success", "updated": item.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "업데이트 중 오류 발생"}), 500

#################### Detail 페이지 작업 ######################

# [POST] /api/detail/grid-row/update 데이터 변경
@app.route("/api/detail/grid-row/update", methods=["POST"])
@jwt_required()
def update_detail_data():
    data = request.get_json()
    if not data or not data.get("id"):
        return jsonify({"error": "No data or ID missing"}), 400

    try:
        detail = Detail.query.get(data["id"])
        if not detail:
            return jsonify({"error": "해당 ID의 데이터 없음"}), 404

        # 필드 업데이트
        detail.customerName = data.get("customerName")
        detail.customerAddress = data.get("customerAddress")
        detail.platform = data.get("platform")
        detail.payment = data.get("payment")
        detail.etc = data.get("etc")

        db.session.commit()
        return jsonify({"message": "Data updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "업데이트 중 오류 발생"}), 500

# [POST] /api/detail/grid-row/add 사용자에게 값을 받아 등록.
@app.route("/api/detail/grid-row/add", methods=["POST"])
@jwt_required()
def add_detail_data():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        detail = Detail(
            id=data["id"],
            customerName=data["customerName"],
            customerAddress=data["customerAddress"],
            platform=data["platform"],
            payment=data["payment"],
            etc=data["etc"],
            ItemId=data["itemId"]
        )

        db.session.add(detail)
        db.session.commit()

        return jsonify({
            "message": "Data received successfully",
            "data": detail.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "등록 중 오류 발생"}), 500

# [POST] /api/detail/grid-row/delete 삭제
@app.route("/api/detail/grid-row/delete", methods=["POST"])
@jwt_required()
def delete_detail_grid_data():
    data = request.get_json()

    if not data or not data.get("id"):
        return jsonify({"error": "ID 누락"}), 400

    try:
        detail = Detail.query.get(data["id"])
        if not detail:
            return jsonify({"error": "해당 데이터 없음"}), 404

        db.session.delete(detail)
        db.session.commit()

        return jsonify({"message": "ok"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "삭제 중 오류 발생"}), 500


# [GET] /api/getDetailGridData/<item_id> 해당 아이디의 정보 가져오기
@app.route("/api/detail/grid-rows/<item_id>", methods=["GET"])
@jwt_required()
def get_detail_grid_data(item_id):
    try:
        details = Detail.query.filter_by(ItemId=item_id).all()
        result = [d.to_dict() for d in details]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "조회 중 오류 발생"}), 500


# [GET] /api/detail/<item_id> 해당 아이디의 정보 가져오기
@app.route("/api/detail/<item_id>", methods=["GET"])
@jwt_required()
def get_detail_info(item_id):
    try:
        item = Item.query.get(item_id)

        if item is None:
            return jsonify({"error": "데이터를 못 찾겠다!"}), 404

        return jsonify(
            item.to_dict()
        ), 200

    except Exception as e:
        return jsonify({"error": "서버 오류"}), 500
    




    
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,port=5000)