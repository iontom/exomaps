import os
import pandas as pd
from redis import Redis
from flask import Flask, render_template, request, session
from flask_bootstrap import Bootstrap
# from flask_migrate import Migrate
# from flask_sqlalchemy import SQLAlchemy
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
db = create_engine(database_uri)

# tpath = '/code/src/app/templates'
app = Flask(__name__, template_folder='./templates')

@app.route('/')
@app.route('/index')
def home():
    df = pd.read_sql_query('SELECT * FROM public.film_test',con=db)
    # return df.to_html()
    print('debug')
    table_out = df.to_html().replace('class="dataframe"', 'class="table table-striped"')
    print(table_out)

    return render_template('home.html', title='Space!', df_table=table_out)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)