from __future__ import annotations

from typing import Final

from aes_site_types import PresidentInfo


SCORE_BIN_WIDTH: Final = 0.25

CATEGORIES: Final = {
    "A": "Economic & Regulatory",
    "B": "Social & Civil Rights",
    "C": "Military & Defense",
    "D": "International & Foreign Policy",
    "E": "Administrative & Personnel",
    "F": "Infrastructure & Public Lands",
    "G": "Ceremonial & Commemorative",
}

DIRECTIVE_TYPES: Final = {
    "eo": "Executive Order",
    "proclamation": "Proclamation",
    "memorandum": "Memorandum",
}

PRESIDENT_ROWS: Final = [
    ("George Washington", "Washington", "Independent"),
    ("John Adams", "J. Adams", "Federalist"),
    ("Thomas Jefferson", "Jefferson", "Democratic-Republican"),
    ("James Madison", "Madison", "Democratic-Republican"),
    ("James Monroe", "Monroe", "Democratic-Republican"),
    ("John Quincy Adams", "J.Q. Adams", "Democratic-Republican"),
    ("Andrew Jackson", "Jackson", "Democratic"),
    ("Martin van Buren", "Van Buren", "Democratic"),
    ("William Henry Harrison", "W.H. Harrison", "Whig"),
    ("John Tyler", "Tyler", "Whig"),
    ("James K. Polk", "Polk", "Democratic"),
    ("Zachary Taylor", "Taylor", "Whig"),
    ("Millard Fillmore", "Fillmore", "Whig"),
    ("Franklin Pierce", "Pierce", "Democratic"),
    ("James Buchanan", "Buchanan", "Democratic"),
    ("Abraham Lincoln", "Lincoln", "Republican"),
    ("Andrew Johnson", "A. Johnson", "National Union"),
    ("Ulysses S. Grant", "Grant", "Republican"),
    ("Rutherford B. Hayes", "Hayes", "Republican"),
    ("James A. Garfield", "Garfield", "Republican"),
    ("Chester A. Arthur", "Arthur", "Republican"),
    ("Grover Cleveland", "Cleveland", "Democratic"),
    ("Benjamin Harrison", "B. Harrison", "Republican"),
    ("William McKinley", "McKinley", "Republican"),
    ("Theodore Roosevelt", "T. Roosevelt", "Republican"),
    ("William Howard Taft", "Taft", "Republican"),
    ("Woodrow Wilson", "Wilson", "Democratic"),
    ("Warren G. Harding", "Harding", "Republican"),
    ("Calvin Coolidge", "Coolidge", "Republican"),
    ("Herbert Hoover", "Hoover", "Republican"),
    ("Franklin D. Roosevelt", "FDR", "Democratic"),
    ("Harry S Truman", "Truman", "Democratic"),
    ("Dwight D. Eisenhower", "Eisenhower", "Republican"),
    ("John F. Kennedy", "Kennedy", "Democratic"),
    ("Lyndon B. Johnson", "LBJ", "Democratic"),
    ("Richard Nixon", "Nixon", "Republican"),
    ("Gerald R. Ford", "Ford", "Republican"),
    ("Jimmy Carter", "Carter", "Democratic"),
    ("Ronald Reagan", "Reagan", "Republican"),
    ("George Bush", "H.W. Bush", "Republican"),
    ("William J. Clinton", "Clinton", "Democratic"),
    ("George W. Bush", "W. Bush", "Republican"),
    ("Barack Obama", "Obama", "Democratic"),
    ("Donald J. Trump (1st Term)", "Trump", "Republican"),
    ("Joseph R. Biden, Jr.", "Biden", "Democratic"),
    ("Donald J. Trump (2nd Term)", "Trump 2", "Republican"),
]

PRESIDENTS: Final = {
    full: PresidentInfo(full=full, short=short, party=party)
    for full, short, party in PRESIDENT_ROWS
}
