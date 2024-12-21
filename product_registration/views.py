from django.shortcuts import render
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
from backend.settings import sendResponse, disconnectDB, connectDB # type: ignore


# Helper function to execute database queries
def execute_query(query, params=None, fetch=False):
    connection = connectDB()
    try:
        cursor = connection.cursor()
        cursor.execute(query, params or [])
        if fetch:
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            result = [
                {columns[i]: row[i] for i in range(len(columns))}
                for row in rows
            ]
            return result
        connection.commit()
    finally:
        disconnectDB(connection)


# Service to register a product
def register_product(request):
    jsons = json.loads(request.body)
    action = jsons.get("action", "no_action")

    try:
        product_name = jsons['product_name']
        product_code = jsons['product_code']
        description = jsons.get('description', "")
        created_at = datetime.now()

        query = """
        INSERT INTO products (product_name, product_code, description, created_at)
        VALUES (%s, %s, %s, %s)
        """
        params = (product_name, product_code, description, created_at)
        execute_query(query, params)

        respdata = [{
            "product_name": product_name,
            "product_code": product_code,
            "description": description,
            "created_at": created_at.strftime("%Y/%m/%d, %H:%M:%S")
        }]
        return sendResponse(request, 200, respdata, action)
    except Exception as e:
        print(f"Error in register_product: {e}")
        return sendResponse(request, 5001, [], action)


# Service to get product details
def get_product(request):
    jsons = json.loads(request.body)
    action = jsons.get("action", "no_action")

    try:
        product_code = jsons['product_code']

        query = "SELECT * FROM products WHERE product_code = %s"
        params = (product_code,)
        respdata = execute_query(query, params, fetch=True)

        return sendResponse(request, 200, respdata, action)
    except Exception as e:
        print(f"Error in get_product: {e}")
        return sendResponse(request, 5002, [], action)


# Service to edit product details
def edit_product(request):
    jsons = json.loads(request.body)
    action = jsons.get("action", "no_action")

    try:
        product_code = jsons['product_code']
        product_name = jsons.get('product_name')
        description = jsons.get('description')

        query = """
        UPDATE products
        SET product_name = %s, description = %s
        WHERE product_code = %s
        """
        params = (product_name, description, product_code)
        execute_query(query, params)

        # Fetch updated product details
        query = "SELECT * FROM products WHERE product_code = %s"
        respdata = execute_query(query, (product_code,), fetch=True)

        return sendResponse(request, 200, respdata, action)
    except Exception as e:
        print(f"Error in edit_product: {e}")
        return sendResponse(request, 5003, [], action)


# Main request handler
@csrf_exempt
def product_service(request):
    if request.method == "POST":
        try:
            jsons = json.loads(request.body)
            action = jsons.get("action", "no_action")
        except json.JSONDecodeError:
            return JsonResponse(sendResponse(request, 3003, [], "no_action"))

        if action == "register_product":
            return JsonResponse(register_product(request))
        elif action == "get_product":
            return JsonResponse(get_product(request))
        elif action == "edit_product":
            return JsonResponse(edit_product(request))
        else:
            return JsonResponse(sendResponse(request, 3001, [], action))
    else:
        return JsonResponse(sendResponse(request, 3002, [], "no_action"))


# Render the product form
def product_form(request):
    return render(request, 'product_form.html')
