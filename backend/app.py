from flask import Flask, send_from_directory, request, Response,jsonify,g
from flask_cors import CORS
import os
import sqlite3

app = Flask(__name__, static_folder="../itemBox-project/dist")
CORS(app,origins=["http://localhost:5173"])

# DB 연결 시도

DATABASE = './database.db'

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db',None)
    if db is not None:
        db.close()

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

#################### Main 페이지 작업 ######################

# [GET] /api/getDetailGridData 물품 정보가 담긴 배열 보내기 
@app.route("/api/getDetailGridData", methods=["GET"])
def get_detail_grid_data():
    try:
        db = get_db()
        cursor = db.execute("""
            SELECT id, name, price, category, category_price,
                wholesale_price, fee, purchase_quantity, sold_quantity,
                release_date, purchase_date, sales_type, etc
            FROM itemDB
        """)
        rows = cursor.fetchall()
        return jsonify([dict(row) for row in rows]),200
    except Exception as e:
        print("DB오류",e)
        return jsonify({"error":"불러오는중중 오류발생"}),500

# [POST] /api/deleteMainGridData 삭제
@app.route("/api/deleteMainGridData",methods=["POST"])
def delMainGridData():
    data = request.get_json()
    try:
        db = get_db()
        db.execute("DELETE FROM itemDB WHERE id = ?",(data.get("id"),))
        db.commit()
        return jsonify({"message":"Data remove successfully"}),200
    except Exception as e:
        print("DB오류",e)
        return jsonify({"error":"삭제중 오류발생"}),500

# [POST] /api/insertMainGridData 등록
@app.route("/api/insertMainData",methods=["POST"])
def insert_grid_data():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"error":"NoData provided-_-"}),400

    try :
        db = get_db();
        db.execute("""
            INSERT INTO itemDB (
                id, name, price, category, category_price, wholesale_price, fee,
                purchase_quantity, sold_quantity, release_date, purchase_date,
                sales_type, etc
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["id"],
            data["name"],
            data["price"],
            data["category"],
            data["category_price"],
            data["wholesale_price"],
            data["fee"],
            data["purchase_quantity"],
            data["sold_quantity"],
            data["release_date"],
            data["purchase_date"],
            data["sales_type"],
            data["etc"]
        ))
        db.commit()
        return jsonify({"message": "Data received successfully", "data": data}), 201
    except Exception as e:
        print(e)
        return jsonify({"error":"what the"})




# [POST] /api/editMainGridData 수정
@app.route("/api/updateMainGridData", methods=["POST"])
def update_main_grid_data():
    data = request.get_json()

    db = get_db()
    db.execute("""
        UPDATE itemDB SET
            name = ?,
            price = ?,
            category = ?,
            category_price = ?,
            wholesale_price = ?,
            fee = ?,
            purchase_quantity = ?,
            sold_quantity = ?,
            release_date = ?,
            purchase_date = ?,
            sales_type = ?,
            etc = ?
        WHERE id = ?
    """, (
        data["name"],
        data["price"],
        data["category"],
        data["category_price"],
        data["wholesale_price"],
        data["fee"],
        data["purchase_quantity"],
        data["sold_quantity"],
        data["release_date"],
        data["purchase_date"],
        data["sales_type"],
        data["etc"],
        data["id"]
    ))
    db.commit()
    return jsonify({"message": "Update success", "updated": data}), 200

#################### Detail 페이지 작업 ######################

# [POST] /api/editDetailGridData 데이터 변경
@app.route("/api/editDetailGridData",methods=["POST"])
def post_detailData():
    data = request.get_json()
    if not data: 
        return jsonify({"error":"NoData provided-_-"}),400
    
    db = get_db();
    db.execute(
        """
            UPDATE detailDB
            SET customerName = ?, customerAddress = ?, platform = ?, payment = ?, etc = ?
            WHERE id = ?
        """,(
            data.get("customerName"),
            data.get("customerAddress"),
            data.get("platform"),
            data.get("payment"),
            data.get("etc"),
            data.get("id")
        )
    )
    db.commit()
    return jsonify({"message": "Data Update successfully"}), 200

# [POST] /api/insertDetailData 사용자에게 값을 받아 등록.
@app.route("/api/insertDetailData", methods=["POST"])
def post_data():

    data = request.get_json()

    db = get_db();
    db.execute(
        '''
        INSERT INTO detailDB
        (id, customerName, customerAddress, platform, payment, etc, itemId) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''',
        (
            data["id"],
            data["customerName"],
            data["customerAddress"],
            data["platform"],
            data["payment"],
            data["etc"],
            data["itemId"]
         )
    )
    db.commit()
    if not data:
        return jsonify({"error":"NoData provided-_-"}),400
    return jsonify({"message": "Data received successfully", "data": data}), 201

# [POST] /api/deleteDetailData 삭제
@app.route("/api/deleteDetailGridData",methods=["POST"])
def deleteDetailGridData():
    data = request.get_json()
    try:
        db = get_db()
        db.execute("DELETE FROM detailDB WHERE id = ?",(data.get("id"),))
        db.commit()
        return jsonify({"message":"Data remove successfully"}),200
    except Exception as e:
        print("DB오류",e)
        return jsonify({"error":"삭제중 오류발생"}),500


# [GET] /api/getDetailGridData/<item_id> 해당 아이디의 정보 가져오기
@app.route("/api/getDetailGridData/<item_id>",methods=["GET"])
def getDetailGridData(item_id):
    db = get_db()
    cursor = db.execute("SELECT * FROM detailDB WHERE itemId = ?",(item_id,))
    rows = cursor.fetchall()
    return jsonify([dict(row) for row in rows]),200

if __name__ == "__main__":
    app.run(debug=True,port=5000)

# [GET] /api/getDetailInfo/<item_id> 해당 아이디의 정보 가져오기
@app.route("/api/getDetailInfo/<item_id>",methods=["GET"])
def getDetailInfo(item_id):
    try:
        db = get_db()
        cursor = db.execute("SELECT * FROM itemDB WHERE id = ?", (item_id,))
        row = cursor.fetchone()

        if row is None:
            return jsonify({"error":"데이터를 못찾겠다!"})
        
        return jsonify(dict(row)),200
    except Exception as e:
        return jsonify({"error":"서버오류"}),500
    