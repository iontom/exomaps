#!/usr/bin/python

import requests
import urllib
import io
import os
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine


def fetch_query(query, target_table):
    url_code = 'http://simbad.u-strasbg.fr/simbad/sim-tap/sync?request=doQuery&lang=adql&format=text&'+\
            'query=' + urllib.parse.quote(query)
            #'query=SELECT%20TOP%2010%20MAIN_ID,RA,DEC%20FROM%20BASIC%20WHERE%20rvz_redshift%20%3E%203.3'

    print('Running data for {}'.format(target_table))
    # print(url_code)
    urlData = requests.get(url_code).content
    df_simbad = pd.read_csv(io.StringIO(urlData.decode('utf-8')), sep='|', skiprows=[1], header=0, skipinitialspace=True)
    print(df_simbad.head(5))
    

    database_uri = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}:{dbport}/{dbname}'.format(
        dbuser=os.environ['DBUSER'],
        dbpass=os.environ['DBPASS'],
        dbhost=os.environ['DBHOST'],
        dbname='exomaps_app',
        dbport=os.environ['DBPORT']
    )

    db = create_engine(database_uri)
    df_simbad.columns = df_simbad.columns.str.strip()
    df_simbad.to_sql(target_table, db, schema='stg_data', if_exists='replace')

# query = """SELECT * 
#     FROM  mesDistance d
#     LEFT JOIN basic b
#         ON d.oidref = b.oid
#     LEFT JOIN IDS i
#         ON d.oidref = i.oidref
#     LEFT JOIN ALLTYPES oat
#         ON d.oidref = oat.oidref
#     LEFT JOIN OTYPEDEF otd
#         ON b.otype = otd.otype
#     LEFT JOIN H_LINK h
#         ON d.oidref = h.child
#     WHERE d.unit = 'pc'
#         AND d.dist < 30
#     ORDER BY dist ASC
# """

q_basic = """SELECT DISTINCT B.* 
            FROM BASIC B
            JOIN mesDistance D
            ON B.oid = D.oidref
            AND D.dist <= 50
            """

fetch_query(q_basic, 'simbad_basic_v1')

# OTYPES + OTYPEDEF custom query
q_otype = """SELECT OT.oidref, OT.otype,
            OTD.otype_longname, OTD.otype_shortname
            FROM OTYPES OT
            LEFT JOIN OTYPEDEF OTD
            ON OT.otype = OTD.otype
            JOIN mesDistance D
            ON OT.oidref = D.oidref
            AND D.dist <= 50
            """

fetch_query(q_otype, 'simbad_otype_v1')

# OTYPES + OTYPEDEF custom query
q_dist = """SELECT *
            FROM mesDistance D
            WHERE D.dist <= 50
            """

fetch_query(q_dist, 'simbad_dist_v1')

table_list = [
    'mesVAR', 'mesVelocities', 'mesRot', 'mesPM', 'IDENT', 'ALLFLUXES', 'MESDIAMETER', 'MESPM', 
    'MESVELOCITIES', 'MESIUE', 'MESHERSCHEL', 'MESFE_H', 'MESMK', 'MESPLX'
    ]  

for src_table in table_list:

    q_template = """SELECT DISTINCT A.* 
                FROM {} A
                JOIN mesDistance D
                ON A.oidref = D.oidref
                AND D.dist <= 50
        """.format(src_table)
    
    fetch_query(q_template,  'simbad_' + src_table.lower() + '_v1')
    
