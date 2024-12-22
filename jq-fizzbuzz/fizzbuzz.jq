def p(d;w): if . % d == 0 then w else null end;

def fizzbuzz: p(3;"Fizz")+p(5;"Buzz")+p(7;"Whizz")//.;

def s: map(tostring)|add;
def test: range(25)+1|[.," -> ", fizzbuzz]|s;

test
