export PYSPARK_PYTHON=python3
sudo pip-3.4 install boto3
python3 run generator.py &
spark-submit --jars /usr/lib/spark/external/lib/spark-streaming-kinesis-asl-assembly_*.jar spark.py &
