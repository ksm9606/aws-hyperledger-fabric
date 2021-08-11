docker rm -f $(docker ps -aq)
docker-compose -f host3.yaml down -v
cd ../first-network/
./byfn.sh down

sleep 5

cd ../raft-5node-swarm

