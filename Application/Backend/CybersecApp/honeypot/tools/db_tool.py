import psycopg2
from psycopg2 import Error


class DBTools:
    def __init__(self, username, password, host, port, database):
        self.username = username
        self.password = password
        self.host = host
        self.port = port
        self.database = database
        self.connection = None
        self.connect()

    def connect(self):
        try:
            # Connect to an existing database
            self.connection = psycopg2.connect(user=self.username,
                                               password=self.password,
                                               host=self.host,
                                               port=self.port,
                                               database=self.database)

        except (Exception, Error) as error:
            pass

    def get_connection(self):
        return self.connection

    def disconnect(self):
        if self.connection:
            self.connection.close()
