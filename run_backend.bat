@echo off
echo Starting SHEETAL.AI Backend...
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
