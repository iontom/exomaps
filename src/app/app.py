import os
import pandas as pd
from redis import Redis
from flask import Flask, render_template, request
# from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

database_uri = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}:{dbport}/{dbname}'.format(
    dbuser=os.environ['DBUSER'],
    dbpass=os.environ['DBPASS'],
    dbhost=os.environ['DBHOST'],
    dbname=os.environ['DBNAME'],
    dbport=os.environ['DBPORT']
)

# app.config.update(
#     SQLALCHEMY_DATABASE_URI=database_uri,
#     SQLALCHEMY_TRACK_MODIFICATIONS=False,
# )

# # initialize the database connection
# db = SQLAlchemy(app)

# db_string = "postgres://admin:donotusethispassword@aws-us-east-1-portal.19.dblayer.com:15813/compose"

db = create_engine(database_uri)

# Create 
# db.execute("CREATE TABLE IF NOT EXISTS films (title text, director text, year text)")  
# db.execute("INSERT INTO public.films (title, director, year) VALUES ('Doctor Strange', 'Scott Derrickson', '2016')")



@app.route('/')
def home():    
    # Read
    # result_set = db.execute("SELECT * FROM public.film_test").fetchone()
    df = pd.read_sql_query('SELECT * FROM public.film_test',con=db)
    # print('result set', result_set)
    # r = result_set['film_name'][0]


    # for r in result_set:  
    #     print(r)
    #     return(r)
    # Update
    # db.execute("UPDATE public.films SET title='Some2016Film' WHERE year='2016'")
    # Delete
    # db.execute("DELETE FROM public.films WHERE year='2016'")  
    print('hello world')
    return df.to_html()
    # from models import Home
    # home = Home.query.all()
    # return render_template('home.html')
    # redis.incr('hits')
    # return 'This Compose/Flask demo has been viewed %s time(s).' % redis.get('hits')

# @app.route('/register', methods=['GET'])
# def view_registration_form():
#     return render_template('guest_registration.html')


# @app.route('/register', methods=['POST'])
# def register_guest():
#     from models import Guest
#     name = request.form.get('name')
#     email = request.form.get('email')

#     guest = Guest(name, email)
#     db.session.add(guest)
#     db.session.commit()

#     return render_template(
#         'guest_confirmation.html', name=name, email=email)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)