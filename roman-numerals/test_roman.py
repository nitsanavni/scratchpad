from roman import roman_to_int


def test_i_converts_to_1():
    assert roman_to_int("I") == 1


def test_v_converts_to_5():
    assert roman_to_int("V") == 5


def test_x_converts_to_10():
    assert roman_to_int("X") == 10


def test_l_converts_to_50():
    assert roman_to_int("L") == 50


def test_c_converts_to_100():
    assert roman_to_int("C") == 100


def test_d_converts_to_500():
    assert roman_to_int("D") == 500


def test_m_converts_to_1000():
    assert roman_to_int("M") == 1000


def test_ii_converts_to_2():
    assert roman_to_int("II") == 2


def test_iv_converts_to_4():
    assert roman_to_int("IV") == 4


def test_ix_converts_to_9():
    assert roman_to_int("IX") == 9


def test_xl_converts_to_40():
    assert roman_to_int("XL") == 40


def test_xc_converts_to_90():
    assert roman_to_int("XC") == 90


def test_cd_converts_to_400():
    assert roman_to_int("CD") == 400


def test_cm_converts_to_900():
    assert roman_to_int("CM") == 900


def test_mcmxc_converts_to_1990():
    assert roman_to_int("MCMXC") == 1990


def test_mmxxi_converts_to_2021():
    assert roman_to_int("MMXXI") == 2021
