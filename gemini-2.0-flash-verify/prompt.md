write a python approval testing utility `verify(thing, test_name)`

I can call it in a test (e.g. a pytest) to verify a text or other printable obj

it compares the thing to the contents of a file: test_name.approved

if te approved file does not exist yet - create an empty one

match: pass

mismatch: fail and launch a diff tool received file vs approved