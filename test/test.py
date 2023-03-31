# PYTHONPATH=./dist python test/test.py  

from xrfragment import xrfragment_Query

q = xrfragment_Query(".foo")

print( q.toObject() )
