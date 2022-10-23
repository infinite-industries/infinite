FROM  jupyter/scipy-notebook:6b49f3337709

USER root
RUN apt update && apt --yes install curl
USER $NB_UID
RUN pip install psycopg2-binary
