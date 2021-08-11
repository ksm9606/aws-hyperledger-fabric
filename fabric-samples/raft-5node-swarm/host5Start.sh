export BYFN_CA5_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org5.example.com/ca && ls *_sk)
docker-compose -f host5.yaml up -d
