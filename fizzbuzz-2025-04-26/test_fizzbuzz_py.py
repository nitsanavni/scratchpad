import subprocess


def test_fizzbuzz_py():
    result = subprocess.run(
        ["uv", "run", "fizzbuzz.py"], 
        capture_output=True, 
        text=True, 
        check=True
    )
    
    output_lines = result.stdout.strip().split('\n')
    
    assert output_lines[0] == "1", "First number should be 1"
    assert output_lines[2] == "Fizz", "3 should be Fizz"
    assert output_lines[4] == "Buzz", "5 should be Buzz"
    assert output_lines[14] == "FizzBuzz", "15 should be FizzBuzz"
    assert output_lines[29] == "FizzBuzz", "30 should be FizzBuzz"
    assert output_lines[98] == "Fizz", "99 should be Fizz"
    assert output_lines[99] == "Buzz", "100 should be Buzz"