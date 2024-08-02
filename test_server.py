import http.server
import socketserver
import json

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self._set_cors_headers()
        self.end_headers()
        response = {'message': 'Request received. Check server logs for details.'}
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')

        if self.path == '/text':
            print(f"Received POST request on /text endpoint. Data: {post_data}")
            response = {'message': 'Text request received. Check server logs for details.'}
        elif self.path == '/image':
            print(f"Received POST request on /image endpoint. Data: {post_data}")
            response = {'message': 'Image URL request received. Check server logs for details.'}
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Endpoint not found.')
            return

        self.send_response(200)
        self._set_cors_headers()
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
        
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

PORT = 8080
Handler = RequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
