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

# [GET] /api/griddata 물품 정보가 담긴 배열 보내기
@app.route("/api/griddata", methods=["GET"])
def get_gridData():
    return jsonify([
    { 
        "id":"1",
        "name": "dols",
      "price": "2222",
      "category": "dolls" 
    },
    {
        "id":"2",
      "name": "2025시즌 프리미엄 하얀색인듯한 검은색 포리",
      "price": "2222",
      "category": "dolls",
    }]),200

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


@app.route("/api/getDetailGridData/<item_id>")
def getDetailGridData(item_id):
    db = get_db()
    cursor = db.execute("SELECT * FROM detailDB WHERE itemId = ?",(item_id,))
    rows = cursor.fetchall()
    return jsonify([dict(row) for row in rows]),200

if __name__ == "__main__":
    app.run(debug=True,port=5000)