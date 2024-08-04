move .dockerignore and Dockerfile.angular to skolera-angular

to build run: 
docker build -t skolera-angular-dev .

to run container run:
docker run -it --rm -p 4200:4200 --name skolera-angular-dev skolera-angular-dev bash

to start while connecting to testing BE run:
npm start

to start while connecting to local BE run:
ng serve --port 4200 --host 0.0.0.0 --disable-host-check -c=localserver
