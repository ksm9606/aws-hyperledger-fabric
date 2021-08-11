docker rm -f $(docker ps -aq)
docker-compose -f host1.yaml down -v
cd ../first-network/
./byfn.sh down

sleep 10

cd ../raft-5node-swarm

