from flask import Flask, send_from_directory, request, Response,jsonify
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../itemBox-project/dist")
CORS(app,origins=["http://localhost:5173"])

#가짜 데이터



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

# [POST] /api/editDetailGridData 변경된 정보.
@app.route("/api/editDetailGridData",methods=["POST"])
def post_detailData():
    data = request.get_json()
    if not data: 
        return jsonify({"error":"NoData provided-_-"}),400
    return jsonify({"message": "Data received successfully", "data": data}), 200

# [POST] /api/postData 데이터 받아오기
@app.route("/api/postData", methods=["POST"])
def post_data():
    data = request.get_json()
    if not data:
        return jsonify({"error":"NoData provided-_-"}),400
    print(data)
    return jsonify({"message": "Data received successfully", "data": data}), 200

if __name__ == "__main__":
    app.run(debug=True,port=5000)