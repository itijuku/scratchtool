from setuptools import setup, find_packages

setup(
    name='scratchtool',
    version='1.0.0',
    author="itijiku",
    author_email = "kanjukuitijuku@gmail.com",
    description="scratch's package",
    install_requires=[
        'requests',
        'beautifulsoup4',
    ],
    entry_points={
    'console_scripts': [
        'scratchtool=scratchtool.main:main',
    ],
    },
    packages=find_packages(),
)
