def p(d; w): 
  if . % d == 0 
  then w 
  else null 
  end;

def fizzbuzz: 
  p(3; "Fizz") + 
  p(5; "Buzz") + 
  p(7; "Whizz") + 
  p(11; "Bang") // .;

def s: map(tostring) | add;

def generate_range(n): range(n) + 1;

def test: generate_range(25) | [.," -> ", fizzbuzz] | s;

test