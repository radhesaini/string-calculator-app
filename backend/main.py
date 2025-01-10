from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
import re

logging.basicConfig(filename='error.log', level=logging.ERROR) 

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MyException(Exception):
    """
    this is custom Exception class
    """

class StringInput(BaseModel):
    numbers: str

class Calculator:
    def add(self, numbers: str) -> int:
        if not numbers:
            return 0
        delimiter_pattern = r"[!@#$%^&*()_+={}|\[\]:;<>,.?/~\n`]| "
        # Split numbers
        numbers = re.split(delimiter_pattern, numbers)
        print("after split your numbers array: ", numbers)
        # Handle negative numbers
        positive_numbers = []
        negative_numbers = []
        for num in numbers:
            if not re.match(r'^-?\d+(\.\d+)?$', num):
                continue
            elif int(num)< 0:
                negative_numbers.append(num)
            elif int(num) <= 1000:
                positive_numbers.append(int(num))

        print("after filter negative and positive: ", negative_numbers, positive_numbers)
        if negative_numbers:
            raise ValueError("negative numbers not allowed - " + ",".join(negative_numbers))
        elif positive_numbers:
            return sum(positive_numbers)
        # Ignore numbers greater than 1000
        return 0

calculator = Calculator()

@app.post("/calculate")
async def calculate(input_data: StringInput):
    try:
        result = calculator.add(input_data.numbers)
        return {"result": result}
    except ValueError as e:
        logging.error(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        print(e)
        raise HTTPException(status_code=500, detail=str(e))