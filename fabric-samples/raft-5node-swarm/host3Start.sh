export BYFN_CA3_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org3.example.com/ca && ls *_sk)
docker-compose -f host3.yaml up -d
