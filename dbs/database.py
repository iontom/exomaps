import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# from fetch_db import simbad
# from fetch_db import exoplanetjpl


user = os.environ['POSTGRES_USER']
pwd = os.environ['POSTGRES_PASSWORD']
db = os.environ['POSTGRES_DB']
appuser = os.environ['APPUSER']
apppwd = os.environ['APPPASS']
# host = os.environ['POSTGRES_HOST']
host = 'db'
port = '5432'
con_str = 'postgres://%s:%s@%s:%s/%s' % (user, pwd, host, port, db)
# print(con_str)
engine = create_engine(con_str)

db_session = scoped_session(sessionmaker(autocommit=True,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def schema_check(schema):
    schema_q = """select exists (select * 
                  from pg_catalog.pg_namespace 
                  where nspname = '{}')""".format(schema)
    schema_bool = engine.execute(schema_q)

    if schema_bool.first() == 'True':
        return True
    else:
        return False


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    # import models
    # Base.metadata.create_all(bind=engine)
    print('init!')
    test = engine.execute('SELECT 1 AS test')
    for row in test:
        print(row[0])

    user_q = """SELECT True FROM pg_roles WHERE rolname='{}'""".format(appuser)

    if engine.execute(user_q).scalar() is None:
        engine.execute("CREATE USER {}".format(appuser))
        engine.execute("CREATE ROLE application")
        engine.execute("GRANT application TO {}".format(appuser))

    schema_list = ['stg_data', 'dm_galaxy', 'app_simulation']

    for schema in schema_list:
        print('Building schema {}'.format(schema))
        engine.execute("CREATE SCHEMA IF NOT EXISTS {}".format(schema))
        engine.execute("GRANT USAGE ON SCHEMA {} TO application".format(schema))
        engine.execute("GRANT SELECT ON ALL TABLES IN SCHEMA {} TO application".format(schema))
        engine.execute("""ALTER DEFAULT PRIVILEGES IN SCHEMA {}
                       GRANT SELECT ON TABLES TO application""".format(schema))


    engine.execute("GRANT INSERT ON ALL TABLES IN SCHEMA app_simulation TO application")
    engine.execute("""ALTER DEFAULT PRIVILEGES IN SCHEMA app_simulation
                   GRANT INSERT ON TABLES TO application""")
    engine.execute("GRANT UPDATE ON ALL TABLES IN SCHEMA app_simulation TO application")
    engine.execute("""ALTER DEFAULT PRIVILEGES IN SCHEMA app_simulation
                   GRANT UPDATE ON TABLES TO application""")


    # DO SIMBAD STUFF
    # smb = simbad

    # Pull Starplot - 2002
    # http://starplot.org/data/sky2000-4-0.93.tar.gz
    # http://starplot.org/data/stars_with_planets_16th_September_2010.stars
    # ftp://cdsarc.u-strasbg.fr/cats/V/70A/catalog.dat.gz




if __name__ == "__main__":
    # app.run(host="0.0.0.0", debug=True)
    print('DB RUN IS UP!')
    init_db();
