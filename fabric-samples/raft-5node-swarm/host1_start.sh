export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.example.com/ca && ls *_sk)
docker-compose -f host1.yaml up -f docker-compose-ca1.yaml -d