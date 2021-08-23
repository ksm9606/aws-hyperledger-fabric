# ✅ 1. 개요
AWS EC2와 docker swarm을 사용해, amazon managed blockchain 없이 하이퍼레저 패브릭 설치 및 raft 오더러 서비스 사용

# ✅ 2. 네트워크 구성

RAFT 오더링 서비스를 사용하기 위해, AWS EC2에서 인스턴스 5개 생성.
각 인스턴스는 블록체인 노드가 된다. 

HOST1 : Orderer1, CA, peer0.org1, msp, couchdb, 웹 클라이언트 서버, cli</br>
HOST2 : Orderer2, CA, peer0.org2, msp, couchdb, 웹 백엔드 서버 </br>
HOST3 : Orderer3, CA, peer0.org3, msp, couchdb </br>
HOST4 : Orderer4, CA, peer0.org4, msp, couchdb </br>
HOST5 : Orderer5, CA, peer0.org5, msp, couchdb</br>

5개의 조직 전부 한 채널에 들어갈 예정



# ✅ 3. 환경설정

## 3.1 AWS EC2서버 생성

AWS EC2로 접속 후 인스턴스 시작

![image](https://user-images.githubusercontent.com/68358404/127076627-1cccaeb3-f67f-450c-b281-daecc84bc868.png)

Ubuntu Server 20.04 LTS 버전 클릭

![image](https://user-images.githubusercontent.com/68358404/127076676-d00b870a-2f9e-4459-889a-b08a69e7ea79.png)

t2.small 선택

![image](https://user-images.githubusercontent.com/54825978/127791023-f95db5fe-874c-48b3-8d33-336d111208ff.png)

단계 6: 보안 그룹 구성
모든 TCP, 모든UDP, 사용자 지정 ICMP/IPv4

![image](https://user-images.githubusercontent.com/54825978/128298477-8905181d-8d03-4f47-9dc9-eb6347821634.png)


- 첫 보안 그룹을 생성 이후, 기존 보안 그룹 선택

검토 및 시작 클릭.

![image](https://user-images.githubusercontent.com/68358404/127077280-14295dfd-166d-4a89-8d1c-74a9cd8c97d5.png)

기존 키가 있는 사람은 그대로 사용하고, 새 키가 필요한 사람은 새 키 패어 생성에서 이름을 설정하고 키 페어를 다운로드 한다.
키 페어는 매우 중요함으로, 잘 보관해야하고 절대로 github에 올리는 실수를 하지 말아야한다. 아니면 aws 계정 정지 당한다.

![image](https://user-images.githubusercontent.com/68358404/127077390-fa2d6a1a-5756-4e11-84a0-794e3168ba28.png)

이런 식으로 EC2 서버 다섯개 생성

![image](https://user-images.githubusercontent.com/68358404/127077804-0e9f77c4-5d8e-44d1-b982-7fbbb79c64d3.png)

## 3.2 탄력적 IP 주소

탄력적 IP 클릭 

![image](https://user-images.githubusercontent.com/54825978/127792155-891ae1a8-dee0-4419-918b-dc6fe8d68bd0.png)

탄력적 IP 주소 연결

![image](https://user-images.githubusercontent.com/54825978/127792193-ae8d4117-e1ea-4787-97c2-19dd97c0ad40.png)

연결할 인스턴스 선택

![image](https://user-images.githubusercontent.com/54825978/127792240-456c4dde-c8e4-44bc-af77-b973d1e656a6.png)

프라이빗 IP 주소 선택 후 연결

![image](https://user-images.githubusercontent.com/54825978/127792260-cf4f4c6e-a806-4d3c-86c8-14e98ff1b42f.png)




## 3.3 하이퍼레저 패브릭 환경설정 설치

DOCKER, GOLANG, NVM, ANGULAR, CURL, GIT, JQ 설치

서버 연결

![image](https://user-images.githubusercontent.com/68358404/127081550-04a57e6c-a3fd-4ded-af08-e36e884615ec.png)

SSH 클라이언트 클릭 후 복사

![image](https://user-images.githubusercontent.com/68358404/127081638-d497029b-64ec-453b-b3f0-ac0263dab467.png)

key가 있는 경로에 git bash 실행

![image](https://user-images.githubusercontent.com/68358404/127081779-87b554fd-741f-457a-929d-7af24bfe52b3.png)

복사한 접속 명령어 붙여넣기 (shift + insert) 그리고 yes를 입력하면 aws 서버 접속

![image](https://user-images.githubusercontent.com/68358404/127082667-35b68668-8fd6-431e-a13d-51fa14b49812.png)

필요한 패키지 설치, 업그레이드

```
sudo apt-get update
sudo apt-get upgrade
```

GO 언어 설치

```
cd /usr/local
sudo wget https://golang.org/dl/go1.16.6.linux-amd64.tar.gz
```

tar.ga 압축풀기 

```
sudo tar -xvf go1.16.6.linux-amd64.tar.gz
sudo rm -rf go1.16.6.linux-amd64.tar.gz
```

GO 환경변수 설정

```
vi ~/.profile
```

i 를 눌러 insert 모드로 바꾼 후 밑에 환경변수 삽입, wq! 저장

```
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
```

- Go 가 설치된 위치 설정
- Project 를 위한 GOPATH 의 위치 설정. 아래에 (src), pkg, bin 폴더가 생길 것이다.
- 실행파일이 저장될 위치들인 $GOPATH/bin 와 $GOROOT/bin 디렉토리를 PATH 에 추가해준다.

```
. ~/.profile
```

환경변수 확인해보기

```
echo = $GOPATH
```

nvm 설치

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

nvm 설치 후

```
. ~/.profile
nvm install --lts
```

angular 설치

```
npm install -g @angular/cli
```

jq 설치

```
sudo apt install jq
```

도커 설치

```
sudo apt install docker.io
```
```
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
sudo su - ubuntu
```

도커 컴포즈 설치

```
sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose -version 
```


# ✅ 4. Docker-Swarm

HOST1에 cli 기능과 docker_swarm 을 사용할 예정
docker_swarm을 통해 5개의 서버를 관리할 예정

HOST1에 접속 (docker swarm join --token {token 정보} {HOST1 IP:2377})

docker-swarm 초기화

```
< HOST 1에서 >
docker swarm init --advertise-addr <HOST1 private ip>
ex)
docker swarm init --advertise-addr 13.209.56.166
docker swarm join-token manager
```

결과 (token 값과 host1 ip + 포트번호)

![image](https://user-images.githubusercontent.com/68358404/127111468-9729205a-2817-4246-9961-a6c122a9317b.png)

HOST2 ~ 5 에서 docker swarm join --token {token 정보} {HOST1 IP:2377} --advertise-addr HOST 2~5 ip 입력

```
< HOST 2 ~ 5에서 >
docker swarm join --token SWMTKN-1-2os9a69d4x62zfpbb2ti7oetquslvk8pqzq0gjyam1zx6dvgzg-a83blf8ypxfeh5rhjk6f3140x 13.209.56.166:2377 --advertise-addr 13.124.175.72
 
docker swarm join --token SWMTKN-1-2os9a69d4x62zfpbb2ti7oetquslvk8pqzq0gjyam1zx6dvgzg-a83blf8ypxfeh5rhjk6f3140x 13.209.56.166:2377 --advertise-addr 3.36.180.104

docker swarm join --token SWMTKN-1-2os9a69d4x62zfpbb2ti7oetquslvk8pqzq0gjyam1zx6dvgzg-a83blf8ypxfeh5rhjk6f3140x 13.209.56.166:2377 --advertise-addr 3.36.151.247

docker swarm join --token SWMTKN-1-2os9a69d4x62zfpbb2ti7oetquslvk8pqzq0gjyam1zx6dvgzg-a83blf8ypxfeh5rhjk6f3140x 13.209.56.166:2377 --advertise-addr 54.180.58.25
```

성공

![image](https://user-images.githubusercontent.com/68358404/127103183-e5473d8c-6dce-4ef6-a06b-e1aa6bf22b2c.png)

docker-swarm 을 사용하면 docker 로 띄워진 peer 들끼리 통신, orderer 와의 통신 등 docker-daemon 간의 network 를 설정해야 한다. 따라서 통신을 위한 overlay network 를 만든다.

```
< HOST 1에서 >
docker network create --attachable --driver overlay first-network
docker network ls
```

![image](https://user-images.githubusercontent.com/68358404/127112966-a4063474-d3d1-4a5d-b7ce-9a8a6f4e80d1.png)
![image](https://user-images.githubusercontent.com/68358404/127113099-2f0788c4-63a7-42a2-89af-870889b3ab63.png)

※ 혹시 토큰 정보를 잃어버린 경우 docker swarm join-token {manager | worker} 를 이용해서 찾으면 된다.

※ 토큰 정보는 중요한 정보이다. 지금은 실습을 이해하기 위해 공개했지만, 외부에 공개하면 안되는 정보이다. 만약 노출되었다면 docker swarm join-token --rotate {manager | worker} 를 이용해서 토큰을 변경할 수 있다.




하이퍼레저 패브릭 설치

```
cd ~/
mkdir -p ./go/src/github.com/hyperledger/
cd ~/go/src/github.com/hyperledger/
curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.12 1.5.0 0.4.22
```


# ✅ 5. 데모
## 1단계 : HOST 불러오기

모든 인스턴스 접속
![image](https://user-images.githubusercontent.com/54825978/127250303-1f05f4b9-d30b-41ab-b736-2cfced32b60b.png)


## 2단계 : Docker Swarm으로 오버레이 네트워크 구성
```
docker network ls
```
HOST2~5 에서 HOST1의 네트워크와 동일한 네트워크 ID를 사용하는지 확인

![image](https://user-images.githubusercontent.com/54825978/127250276-75e7cf39-5971-40ea-8243-1922f69b5aee.png)
![image](https://user-images.githubusercontent.com/54825978/127250557-b2503013-f488-4fb6-9c45-1a0bf2dff483.png)


## 3단계 : HOST1에서 패브릭 네트워크 자료를 준비하고 다른 사람에게 복사
중요한 부분 중 하나는 모든 구성 요소가 동일한 암호화 자료를 공유하는지 확인하는 것입니다. </br>
호스트 1을 사용하여 자료를 만들고 다른 호스트에 복사합니다. </br>
이론적으로 신원(인증서 및 서명 키)이 필요한 체계를 따르도록 하기만 하면 됩니다. </br>
조직(예: org1)의 인증서는 동일한 CA(ca.org1)에서 발급하고 서명합니다. 이것은 cryptogen을 사용하여 보장됩니다 .</br>
단순화를 위해 이 데모에서는 호스트 1에 모든 자료를 만들고 전체 디렉토리를 다른 호스트에 복사합니다.</br>

#### HOST1에서
```
cd fabric-samples
mkdir raft-5node-swarm
cd raft-5node-swarm
```
우리는 첫 번째 네트워크에서 직접 crypto-config.yaml및 configtx.yaml파일을 복사 합니다. (참여조직5개, 조직 당 peer1개 ,,, 코드 수정)
```
cp ../first-network/crypto-config.yaml . 
cp ../first-network/configtx.yaml .
```
### crypto-config.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

# ---------------------------------------------------------------------------
# "OrdererOrgs" - Definition of organizations managing orderer nodes
# ---------------------------------------------------------------------------
OrdererOrgs:
  # ---------------------------------------------------------------------------
  # Orderer
  # ---------------------------------------------------------------------------
  - Name: Orderer
    Domain: example.com
    EnableNodeOUs: true
    # ---------------------------------------------------------------------------
    # "Specs" - See PeerOrgs below for complete description
    # ---------------------------------------------------------------------------
    Specs:
      - Hostname: orderer
      - Hostname: orderer2
      - Hostname: orderer3
      - Hostname: orderer4
      - Hostname: orderer5

# ---------------------------------------------------------------------------
# "PeerOrgs" - Definition of organizations managing peer nodes
# ---------------------------------------------------------------------------
PeerOrgs:
  # ---------------------------------------------------------------------------
  # Org1
  # ---------------------------------------------------------------------------
  - Name: Org1
    Domain: org1.example.com
    EnableNodeOUs: true
    # ---------------------------------------------------------------------------
    # "Specs"
    # ---------------------------------------------------------------------------
    # Uncomment this section to enable the explicit definition of hosts in your
    # configuration.  Most users will want to use Template, below
    #
    # Specs is an array of Spec entries.  Each Spec entry consists of two fields:
    #   - Hostname:   (Required) The desired hostname, sans the domain.
    #   - CommonName: (Optional) Specifies the template or explicit override for
    #                 the CN.  By default, this is the template:
    #
    #                              "{{.Hostname}}.{{.Domain}}"
    #
    #                 which obtains its values from the Spec.Hostname and
    #                 Org.Domain, respectively.
    # ---------------------------------------------------------------------------
    # Specs:
    #   - Hostname: foo # implicitly "foo.org1.example.com"
    #     CommonName: foo27.org5.example.com # overrides Hostname-based FQDN set above
    #   - Hostname: bar
    #   - Hostname: baz
    # ---------------------------------------------------------------------------
    # "Template"
    # ---------------------------------------------------------------------------
    # Allows for the definition of 1 or more hosts that are created sequentially
    # from a template. By default, this looks like "peer%d" from 0 to Count-1.
    # You may override the number of nodes (Count), the starting index (Start)
    # or the template used to construct the name (Hostname).
    #
    # Note: Template and Specs are not mutually exclusive.  You may define both
    # sections and the aggregate nodes will be created for you.  Take care with
    # name collisions
    # ---------------------------------------------------------------------------
    Template:
      Count: 2
      # Start: 5
      # Hostname: {{.Prefix}}{{.Index}} # default
    # ---------------------------------------------------------------------------
    # "Users"
    # ---------------------------------------------------------------------------
    # Count: The number of user accounts _in addition_ to Admin
    # ---------------------------------------------------------------------------
    Users:
      Count: 1
  # ---------------------------------------------------------------------------
  # Org2: See "Org1" for full specification
  # ---------------------------------------------------------------------------
  - Name: Org2
    Domain: org2.example.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1

  - Name: Org3
    Domain: org3.example.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1

  - Name: Org4
    Domain: org4.example.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1

  - Name: Org5
    Domain: org5.example.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1
```
### configtx.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

---
################################################################################
#
#   Section: Organizations
#
#   - This section defines the different organizational identities which will
#   be referenced later in the configuration.
#
################################################################################
Organizations:

    # SampleOrg defines an MSP using the sampleconfig.  It should never be used
    # in production but may be used as a template for other definitions
    - &OrdererOrg
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: OrdererOrg

        # ID to load the MSP definition as
        ID: OrdererMSP

        # MSPDir is the filesystem path which contains the MSP configuration
        MSPDir: crypto-config/ordererOrganizations/example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('OrdererMSP.member')"
            Writers:
                Type: Signature
                Rule: "OR('OrdererMSP.member')"
            Admins:
                Type: Signature
                Rule: "OR('OrdererMSP.admin')"

    - &Org1
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: Org1MSP

        # ID to load the MSP definition as
        ID: Org1MSP

        MSPDir: crypto-config/peerOrganizations/org1.example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('Org1MSP.admin', 'Org1MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('Org1MSP.admin')"

        # leave this flag set to true.
        AnchorPeers:
            # AnchorPeers defines the location of peers which can be used
            # for cross org gossip communication.  Note, this value is only
            # encoded in the genesis block in the Application section context
            - Host: peer0.org1.example.com
              Port: 7051

    - &Org2
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: Org2MSP

        # ID to load the MSP definition as
        ID: Org2MSP

        MSPDir: crypto-config/peerOrganizations/org2.example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('Org2MSP.admin')"

        AnchorPeers:
            # AnchorPeers defines the location of peers which can be used
            # for cross org gossip communication.  Note, this value is only
            # encoded in the genesis block in the Application section context
            - Host: peer0.org2.example.com
              Port: 8051

    - &Org3
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: Org3MSP

        # ID to load the MSP definition as
        ID: Org3MSP

        MSPDir: crypto-config/peerOrganizations/org3.example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('Org3MSP.admin', 'Org3MSP.peer', 'Org3MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('Org3MSP.admin', 'Org3MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('Org3MSP.admin')"

        AnchorPeers:
            # AnchorPeers defines the location of peers which can be used
            # for cross org gossip communication.  Note, this value is only
            # encoded in the genesis block in the Application section context
            - Host: peer0.org3.example.com
              Port: 9051


    - &Org4
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: Org4MSP

        # ID to load the MSP definition as
        ID: Org4MSP

        MSPDir: crypto-config/peerOrganizations/org4.example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('Org4MSP.admin', 'Org4MSP.peer', 'Org4MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('Org4MSP.admin', 'Org4MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('Org4MSP.admin')"

        AnchorPeers:
            # AnchorPeers defines the location of peers which can be used
            # for cross org gossip communication.  Note, this value is only
            # encoded in the genesis block in the Application section context
            - Host: peer0.org4.example.com
              Port: 10051


    - &Org5
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: Org5MSP

        # ID to load the MSP definition as
        ID: Org5MSP

        MSPDir: crypto-config/peerOrganizations/org5.example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('Org5MSP.admin', 'Org5MSP.peer', 'Org5MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('Org5MSP.admin', 'Org5MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('Org5MSP.admin')"

        AnchorPeers:
            # AnchorPeers defines the location of peers which can be used
            # for cross org gossip communication.  Note, this value is only
            # encoded in the genesis block in the Application section context
            - Host: peer0.org5.example.com
              Port: 11051

################################################################################
#
#   SECTION: Capabilities
#
#   - This section defines the capabilities of fabric network. This is a new
#   concept as of v1.1.0 and should not be utilized in mixed networks with
#   v1.0.x peers and orderers.  Capabilities define features which must be
#   present in a fabric binary for that binary to safely participate in the
#   fabric network.  For instance, if a new MSP type is added, newer binaries
#   might recognize and validate the signatures from this type, while older
#   binaries without this support would be unable to validate those
#   transactions.  This could lead to different versions of the fabric binaries
#   having different world states.  Instead, defining a capability for a channel
#   informs those binaries without this capability that they must cease
#   processing transactions until they have been upgraded.  For v1.0.x if any
#   capabilities are defined (including a map with all capabilities turned off)
#   then the v1.0.x peer will deliberately crash.
#
################################################################################
Capabilities:
    # Channel capabilities apply to both the orderers and the peers and must be
    # supported by both.
    # Set the value of the capability to true to require it.
    Channel: &ChannelCapabilities
        # V1.4.3 for Channel is a catchall flag for behavior which has been
        # determined to be desired for all orderers and peers running at the v1.4.3
        # level, but which would be incompatible with orderers and peers from
        # prior releases.
        # Prior to enabling V1.4.3 channel capabilities, ensure that all
        # orderers and peers on a channel are at v1.4.3 or later.
        V1_4_3: true
        # V1.3 for Channel enables the new non-backwards compatible
        # features and fixes of fabric v1.3
        V1_3: false
        # V1.1 for Channel enables the new non-backwards compatible
        # features and fixes of fabric v1.1
        V1_1: false

    # Orderer capabilities apply only to the orderers, and may be safely
    # used with prior release peers.
    # Set the value of the capability to true to require it.
    Orderer: &OrdererCapabilities
        # V1.4.2 for Orderer is a catchall flag for behavior which has been
        # determined to be desired for all orderers running at the v1.4.2
        # level, but which would be incompatible with orderers from prior releases.
        # Prior to enabling V1.4.2 orderer capabilities, ensure that all
        # orderers on a channel are at v1.4.2 or later.
        V1_4_2: true
        # V1.1 for Orderer enables the new non-backwards compatible
        # features and fixes of fabric v1.1
        V1_1: false

    # Application capabilities apply only to the peer network, and may be safely
    # used with prior release orderers.
    # Set the value of the capability to true to require it.
    Application: &ApplicationCapabilities
        # V1.4.2 for Application enables the new non-backwards compatible
        # features and fixes of fabric v1.4.2.
        V1_4_2: true
        # V1.3 for Application enables the new non-backwards compatible
        # features and fixes of fabric v1.3.
        V1_3: false
        # V1.2 for Application enables the new non-backwards compatible
        # features and fixes of fabric v1.2 (note, this need not be set if
        # later version capabilities are set)
        V1_2: false
        # V1.1 for Application enables the new non-backwards compatible
        # features and fixes of fabric v1.1 (note, this need not be set if
        # later version capabilities are set).
        V1_1: false

################################################################################
#
#   SECTION: Application
#
#   - This section defines the values to encode into a config transaction or
#   genesis block for application related parameters
#
################################################################################
Application: &ApplicationDefaults

    # Organizations is the list of orgs which are defined as participants on
    # the application side of the network
    Organizations:

    # Policies defines the set of policies at this level of the config tree
    # For Application policies, their canonical path is
    #   /Channel/Application/<PolicyName>
    Policies:
        Readers:
            Type: ImplicitMeta
            Rule: "ANY Readers"
        Writers:
            Type: ImplicitMeta
            Rule: "ANY Writers"
        Admins:
            Type: ImplicitMeta
            Rule: "MAJORITY Admins"

    Capabilities:
        <<: *ApplicationCapabilities
################################################################################
#
#   SECTION: Orderer
#
#   - This section defines the values to encode into a config transaction or
#   genesis block for orderer related parameters
#
################################################################################
Orderer: &OrdererDefaults

    # Orderer Type: The orderer implementation to start
    # Available types are "solo","kafka"  and "etcdraft"
    OrdererType: solo

    Addresses:
        - orderer.example.com:7050

    # Batch Timeout: The amount of time to wait before creating a batch
    BatchTimeout: 2s

    # Batch Size: Controls the number of messages batched into a block
    BatchSize:

        # Max Message Count: The maximum number of messages to permit in a batch
        MaxMessageCount: 10

        # Absolute Max Bytes: The absolute maximum number of bytes allowed for
        # the serialized messages in a batch.
        AbsoluteMaxBytes: 99 MB

        # Preferred Max Bytes: The preferred maximum number of bytes allowed for
        # the serialized messages in a batch. A message larger than the preferred
        # max bytes will result in a batch larger than preferred max bytes.
        PreferredMaxBytes: 512 KB

    Kafka:
        # Brokers: A list of Kafka brokers to which the orderer connects
        # NOTE: Use IP:port notation
        Brokers:
            - 127.0.0.1:9092

    # EtcdRaft defines configuration which must be set when the "etcdraft"
    # orderertype is chosen.
    EtcdRaft:
        # The set of Raft replicas for this network. For the etcd/raft-based
        # implementation, we expect every replica to also be an OSN. Therefore,
        # a subset of the host:port items enumerated in this list should be
        # replicated under the Orderer.Addresses key above.
        Consenters:
            - Host: orderer.example.com
              Port: 7050
              ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
              ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
            - Host: orderer2.example.com
              Port: 7050
              ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
              ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
            - Host: orderer3.example.com
              Port: 7050
              ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
              ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
            - Host: orderer4.example.com
              Port: 7050
              ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer4.example.com/tls/server.crt
              ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer4.example.com/tls/server.crt
            - Host: orderer5.example.com
              Port: 7050
              ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer5.example.com/tls/server.crt
              ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer5.example.com/tls/server.crt

    # Organizations is the list of orgs which are defined as participants on
    # the orderer side of the network
    Organizations:

    # Policies defines the set of policies at this level of the config tree
    # For Orderer policies, their canonical path is
    #   /Channel/Orderer/<PolicyName>
    Policies:
        Readers:
            Type: ImplicitMeta
            Rule: "ANY Readers"
        Writers:
            Type: ImplicitMeta
            Rule: "ANY Writers"
        Admins:
            Type: ImplicitMeta
            Rule: "MAJORITY Admins"
        # BlockValidation specifies what signatures must be included in the block
        # from the orderer for the peer to validate it.
        BlockValidation:
            Type: ImplicitMeta
            Rule: "ANY Writers"

################################################################################
#
#   CHANNEL
#
#   This section defines the values to encode into a config transaction or
#   genesis block for channel related parameters.
#
################################################################################
Channel: &ChannelDefaults
    # Policies defines the set of policies at this level of the config tree
    # For Channel policies, their canonical path is
    #   /Channel/<PolicyName>
    Policies:
        # Who may invoke the 'Deliver' API
        Readers:
            Type: ImplicitMeta
            Rule: "ANY Readers"
        # Who may invoke the 'Broadcast' API
        Writers:
            Type: ImplicitMeta
            Rule: "ANY Writers"
        # By default, who may modify elements at this config level
        Admins:
            Type: ImplicitMeta
            Rule: "MAJORITY Admins"

    # Capabilities describes the channel level capabilities, see the
    # dedicated Capabilities section elsewhere in this file for a full
    # description
    Capabilities:
        <<: *ChannelCapabilities

################################################################################
#
#   Profile
#
#   - Different configuration profiles may be encoded here to be specified
#   as parameters to the configtxgen tool
#
################################################################################
Profiles:

    TwoOrgsOrdererGenesis:
        <<: *ChannelDefaults
        Orderer:
            <<: *OrdererDefaults
            Organizations:
                - *OrdererOrg
            Capabilities:
                <<: *OrdererCapabilities
        Consortiums:
            SampleConsortium:
                Organizations:
                    - *Org1
                    - *Org2
                    - *Org3
                    - *Org4
                    - *Org5
    FiveOrgsChannel:
        Consortium: SampleConsortium
        <<: *ChannelDefaults
        Application:
            <<: *ApplicationDefaults
            Organizations:
                - *Org1
                - *Org2
                - *Org3
                - *Org4
                - *Org5
            Capabilities:
                <<: *ApplicationCapabilities

    SampleDevModeKafka:
        <<: *ChannelDefaults
        Capabilities:
            <<: *ChannelCapabilities
        Orderer:
            <<: *OrdererDefaults
            OrdererType: kafka
            Kafka:
                Brokers:
                - kafka.example.com:9092

            Organizations:
            - *OrdererOrg
            Capabilities:
                <<: *OrdererCapabilities
        Application:
            <<: *ApplicationDefaults
            Organizations:
            - <<: *OrdererOrg
        Consortiums:
            SampleConsortium:
                Organizations:
                - *Org1
                - *Org2
                - *Org3
                - *Org4
                - *Org5

    SampleMultiNodeEtcdRaft:
        <<: *ChannelDefaults
        Capabilities:
            <<: *ChannelCapabilities
        Orderer:
            <<: *OrdererDefaults
            OrdererType: etcdraft
            EtcdRaft:
                Consenters:
                - Host: orderer.example.com
                  Port: 7050
                  ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
                  ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
                - Host: orderer2.example.com
                  Port: 8050
                  ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
                  ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
                - Host: orderer3.example.com
                  Port: 9050
                  ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
                  ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt
                - Host: orderer4.example.com
                  Port: 10050
                  ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer4.example.com/tls/server.crt
                  ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer4.example.com/tls/server.crt
                - Host: orderer5.example.com
                  Port: 11050
                  ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer5.example.com/tls/server.crt
                  ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/orderer5.example.com/tls/server.crt
            Addresses:
                - orderer.example.com:7050
                - orderer2.example.com:8050
                - orderer3.example.com:9050
                - orderer4.example.com:10050
                - orderer5.example.com:11050

            Organizations:
            - *OrdererOrg
            Capabilities:
                <<: *OrdererCapabilities
        Application:
            <<: *ApplicationDefaults
            Organizations:
            - <<: *OrdererOrg
        Consortiums:
            SampleConsortium:
                Organizations:
                - *Org1
                - *Org2
                - *Org3
                - *Org4
                - *Org5
```


그런 다음 필요한 재료를 생성합니다.
```
../bin/cryptogen generate --config=./crypto-config.yaml

export FABRIC_CFG_PATH=$PWD

mkdir channel-artifacts

../bin/configtxgen -profile SampleMultiNodeEtcdRaft -outputBlock ./channel-artifacts/genesis.block

../bin/configtxgen -profile FiveOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel

../bin/configtxgen -profile FiveOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

../bin/configtxgen -profile FiveOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

../bin/configtxgen -profile FiveOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org3MSPanchors.tx -channelID mychannel -asOrg Org3MSP

../bin/configtxgen -profile FiveOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org4MSPanchors.tx -channelID mychannel -asOrg Org4MSP

../bin/configtxgen -profile FiveOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org5MSPanchors.tx -channelID mychannel -asOrg Org5MSP
```


이제 모든 호스트에 대한 docker-compose 파일을 준비하고 있습니다. 우리는 적절한 수정을 통해 First-Network에 있는 것을 주로 기반으로 합니다. 여기에서 8개의 파일을 만들고 있습니다.
<ul>
 <li> base/peer-base.yaml </li>
 <li> base/docker-compose-peer.yaml </li>
 <li> host1.yaml </li>
 <li> host2.yaml </li>
 <li> host3.yaml </li>
 <li> host4.yaml </li>
 <li> host5.yaml </li>
 <li> .env </li>
</ul>

![image](https://user-images.githubusercontent.com/54825978/127280171-d6b06b55-920d-4712-bb69-5b271702faa4.png)


### base/peer-base.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

services:
  peer-base:
    image: hyperledger/fabric-peer:$IMAGE_TAG
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      # the following setting starts chaincode containers on the same
      # bridge network as the peers
      # https://docs.docker.com/compose/networking/
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=first-network
      - FABRIC_LOGGING_SPEC=INFO
      #- FABRIC_LOGGING_SPEC=DEBUG
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_GOSSIP_USELEADERELECTION=true
      - CORE_PEER_GOSSIP_ORGLEADER=false
      - CORE_PEER_PROFILE_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
    command: peer node start

  orderer-base:
    image: hyperledger/fabric-orderer:$IMAGE_TAG
    environment:
      - FABRIC_LOGGING_SPEC=INFO
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
      # enabled TLS
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_KAFKA_TOPIC_REPLICATIONFACTOR=1
      - ORDERER_KAFKA_VERBOSE=true
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_CLUSTER_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric
    command: orderer
```
### base/docker-compose-base.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

services:

  orderer.example.com:
    container_name: orderer.example.com
    extends:
      file: peer-base.yaml
      service: orderer-base
    volumes:
        - ../channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ../crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp:/var/hyperledger/orderer/msp
        - ../crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/:/var/hyperledger/orderer/tls
        - orderer.example.com:/var/hyperledger/production/orderer
    ports:
      - 7050:7050

  peer0.org1.example.com:
    container_name: peer0.org1.example.com
    extends:
      file: peer-base.yaml
      service: peer-base
    environment:
      - CORE_PEER_ID=peer0.org1.example.com
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:7051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org1.example.com:7052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:7052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.example.com:7051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
    volumes:
        - /var/run/:/host/var/run/
        - ../crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp:/etc/hyperledger/fabric/msp
        - ../crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls:/etc/hyperledger/fabric/tls
        - peer0.org1.example.com:/var/hyperledger/production
    ports:
      - 7051:7051

  peer0.org2.example.com:
    container_name: peer0.org2.example.com
    extends:
      file: peer-base.yaml
      service: peer-base
    environment:
      - CORE_PEER_ID=peer0.org2.example.com
      - CORE_PEER_ADDRESS=peer0.org2.example.com:8051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:8051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org2.example.com:8052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:8052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org2.example.com:8051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org2.example.com:8051
      - CORE_PEER_LOCALMSPID=Org2MSP
    volumes:
        - /var/run/:/host/var/run/
        - ../crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/msp:/etc/hyperledger/fabric/msp
        - ../crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls:/etc/hyperledger/fabric/tls
        - peer0.org2.example.com:/var/hyperledger/production
    ports:
      - 8051:8051

  peer0.org3.example.com:
    container_name: peer0.org3.example.com
    extends:
      file: peer-base.yaml
      service: peer-base
    environment:
      - CORE_PEER_ID=peer0.org3.example.com
      - CORE_PEER_ADDRESS=peer0.org3.example.com:9051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:9051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org3.example.com:9052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:9052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org3.example.com:9051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org3.example.com:9051
      - CORE_PEER_LOCALMSPID=Org3MSP
    volumes:
        - /var/run/:/host/var/run/
        - ../crypto-config/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/msp:/etc/hyperledger/fabric/msp
        - ../crypto-config/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls:/etc/hyperledger/fabric/tls
        - peer0.org3.example.com:/var/hyperledger/production
    ports:
      - 9051:9051

  peer0.org4.example.com:
    container_name: peer0.org4.example.com
    extends:
      file: peer-base.yaml
      service: peer-base
    environment:
      - CORE_PEER_ID=peer0.org4.example.com
      - CORE_PEER_ADDRESS=peer0.org4.example.com:10051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:10051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org4.example.com:10052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:10052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org4.example.com:10051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org4.example.com:10051
      - CORE_PEER_LOCALMSPID=Org4MSP
    volumes:
        - /var/run/:/host/var/run/
        - ../crypto-config/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/msp:/etc/hyperledger/fabric/msp
        - ../crypto-config/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls:/etc/hyperledger/fabric/tls
        - peer0.org4.example.com:/var/hyperledger/production
    ports:
      - 10051:10051

  peer0.org5.example.com:
    container_name: peer0.org5.example.com
    extends:
      file: peer-base.yaml
      service: peer-base
    environment:
      - CORE_PEER_ID=peer0.org5.example.com
      - CORE_PEER_ADDRESS=peer0.org5.example.com:11051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:11051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org5.example.com:11052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:11052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org5.example.com:11051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org5.example.com:11051
      - CORE_PEER_LOCALMSPID=Org5MSP
    volumes:
        - /var/run/:/host/var/run/
        - ../crypto-config/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/msp:/etc/hyperledger/fabric/msp
        - ../crypto-config/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls:/etc/hyperledger/fabric/tls
        - peer0.org5.example.com:/var/hyperledger/production
    ports:
      - 11051:11051
```


### host1.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

volumes:
  orderer.example.com:
  peer0.org1.example.com:
  ca.org1.example.com:

networks:
  byfn:
    external:
      name: first-network

services:

  ca.org1.example.com:
    image: hyperledger/fabric-ca
    environment:
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca.org1.example.com
      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem
      # - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/ef5cb5b9ef770fb136dd2084d90b1be591b3cd70e90b885a8b1f8ec618b914e6_sk
      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/${BYFN_CA1_PRIVATE_KEY}
    ports:
      - "7054:7054"
    command: sh -c 'fabric-ca-server start -b admin:adminpw'
    volumes:
      - ./crypto-config/peerOrganizations/org1.example.com/ca/:/etc/hyperledger/fabric-ca-server-config
    container_name: ca.org1.example.com
    networks:
      - byfn

  orderer.example.com:
    extends:
      file: base/docker-compose-base.yaml
      service: orderer.example.com
    container_name: orderer.example.com
    networks:
    - byfn
    volumes:
        - ./channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp:/var/hyperledger/orderer/msp
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/:/var/hyperledger/orderer/tls
        - orderer.example.com:/var/hyperledger/production/orderer
    ports:
    - 7050:7050

  couchdb1:
    container_name: couchdb1
    image: hyperledger/fabric-couchdb
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "5984:5984"
    networks:
      - byfn

  peer0.org1.example.com:
    container_name: peer0.org1.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org1.example.com
    environment:
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb1:5984
      # The CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME and CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD
      # provide the credentials for ledger to connect to CouchDB.  The username and password must
      # match the username and password set for the associated CouchDB.
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    networks:
      - byfn

  cli:
    container_name: cli
    image: hyperledger/fabric-tools:$IMAGE_TAG
    tty: true
    stdin_open: true
    environment:
      - SYS_CHANNEL=$SYS_CHANNEL
      - GOPATH=/opt/gopath
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      #- FABRIC_LOGGING_SPEC=DEBUG
      - FABRIC_LOGGING_SPEC=INFO
      - CORE_PEER_ID=cli
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
      - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
    command: /bin/bash
    volumes:
        - /var/run/:/host/var/run/
        - ./../chaincode/:/opt/gopath/src/github.com/chaincode
        - ./crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
        - ./scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
        - ./channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts
    depends_on:
      - orderer.example.com
      - peer0.org1.example.com
      - ca.org1.example.com
      - couchdb1

    networks:
      - byfn
```

### host2.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

volumes:
  orderer2.example.com:
  peer0.org2.example.com:

networks:
  byfn:
    external:
      name: first-network

services:

  ca.org2.example.com:
    image: hyperledger/fabric-ca
    environment:
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca.org2.example.com
      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org2.example.com-cert.pem
      # - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/ef5cb5b9ef770fb136dd2084d90b1be591b3cd70e90b885a8b1f8ec618b914e6_sk
      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/${BYFN_CA2_PRIVATE_KEY}
    ports:
      - "8054:7054"
    command: sh -c 'fabric-ca-server start -b admin:adminpw'
    volumes:
      - ./crypto-config/peerOrganizations/org2.example.com/ca/:/etc/hyperledger/fabric-ca-server-config
    container_name: ca.org2.example.com
    networks:
      - byfn

  orderer2.example.com:
    extends:
      file: base/peer-base.yaml
      service: orderer-base
    container_name: orderer2.example.com
    networks:
    - byfn
    volumes:
        - ./channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/msp:/var/hyperledger/orderer/msp
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/:/var/hyperledger/orderer/tls
        - orderer2.example.com:/var/hyperledger/production/orderer
    ports:
    - 7050:7050

  couchdb2:
    container_name: couchdb2
    image: hyperledger/fabric-couchdb
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "6984:5984"
    networks:
      - byfn

  peer0.org2.example.com:
    container_name: peer0.org2.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org2.example.com
    environment:
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb2:5984
      # The CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME and CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD
      # provide the credentials for ledger to connect to CouchDB.  The username and password must
      # match the username and password set for the associated CouchDB.
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    networks:
      - byfn
```

### host3.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

volumes:
  orderer3.example.com:
  peer0.org3.example.com:

networks:
  byfn:
    external:
      name: first-network

services:


  ca.org3.example.com:
    image: hyperledger/fabric-ca
    environment:
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca.org3.example.com
      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org3.example.com-cert.pem
      # - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/ef5cb5b9ef770fb136dd2084d90b1be591b3cd70e90b885a8b1f8ec618b914e6_sk
      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/${BYFN_CA3_PRIVATE_KEY}
    ports:
      - "9054:7054"
    command: sh -c 'fabric-ca-server start -b admin:adminpw'
    volumes:
      - ./crypto-config/peerOrganizations/org3.example.com/ca/:/etc/hyperledger/fabric-ca-server-config
    container_name: ca.org3.example.com
    networks:
      - byfn

  orderer3.example.com:
    extends:
      file: base/peer-base.yaml
      service: orderer-base
    container_name: orderer3.example.com
    networks:
    - byfn
    volumes:
        - ./channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/msp:/var/hyperledger/orderer/msp
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/:/var/hyperledger/orderer/tls
        - orderer3.example.com:/var/hyperledger/production/orderer
    ports:
    - 7050:7050

  couchdb3:
    container_name: couchdb3
    image: hyperledger/fabric-couchdb
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "7984:5984"
    networks:
      - byfn

  peer0.org3.example.com:
    container_name: peer0.org3.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org3.example.com
    environment:
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb3:5984
      # The CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME and CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD
      # provide the credentials for ledger to connect to CouchDB.  The username and password must
      # match the username and password set for the associated CouchDB.
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    networks:
      - byfn
```

### host4.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

volumes:
  orderer4.example.com:
  peer0.org4.example.com:

networks:
  byfn:
    external:
      name: first-network

services:

  ca.org4.example.com:
    image: hyperledger/fabric-ca
    environment:
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca.org4.example.com
      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org4.example.com-cert.pem
      # - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/ef5cb5b9ef770fb136dd2084d90b1be591b3cd70e90b885a8b1f8ec618b914e6_sk
      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/${BYFN_CA4_PRIVATE_KEY}
    ports:
      - "10054:7054"
    command: sh -c 'fabric-ca-server start -b admin:adminpw'
    volumes:
      - ./crypto-config/peerOrganizations/org4.example.com/ca/:/etc/hyperledger/fabric-ca-server-config
    container_name: ca.org4.example.com
    networks:
      - byfn


  orderer4.example.com:
    extends:
      file: base/peer-base.yaml
      service: orderer-base
    container_name: orderer4.example.com
    networks:
    - byfn
    volumes:
        - ./channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer4.example.com/msp:/var/hyperledger/orderer/msp
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer4.example.com/tls/:/var/hyperledger/orderer/tls
        - orderer4.example.com:/var/hyperledger/production/orderer
    ports:
    - 7050:7050

  couchdb4:
    container_name: couchdb4
    image: hyperledger/fabric-couchdb
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "10984:5984"
    networks:
      - byfn

  peer0.org4.example.com:
    container_name: peer0.org4.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org4.example.com
    environment:
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb4:5984
      # The CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME and CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD
      # provide the credentials for ledger to connect to CouchDB.  The username and password must
      # match the username and password set for the associated CouchDB.
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    networks:
      - byfn
```

### host5.yaml
```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

volumes:
  orderer5.example.com:
  peer0.org5.example.com:

networks:
  byfn:
    external:
      name: first-network

services:

  ca.org5.example.com:
    image: hyperledger/fabric-ca
    environment:
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca.org5.example.com
      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org5.example.com-cert.pem
      # - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/ef5cb5b9ef770fb136dd2084d90b1be591b3cd70e90b885a8b1f8ec618b914e6_sk
      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/${BYFN_CA5_PRIVATE_KEY}
    ports:
      - "11054:7054"
    command: sh -c 'fabric-ca-server start -b admin:adminpw'
    volumes:
      - ./crypto-config/peerOrganizations/org5.example.com/ca/:/etc/hyperledger/fabric-ca-server-config
    container_name: ca.org5.example.com
    networks:
      - byfn

  orderer5.example.com:
    extends:
      file: base/peer-base.yaml
      service: orderer-base
    container_name: orderer5.example.com
    networks:
    - byfn
    volumes:
        - ./channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer5.example.com/msp:/var/hyperledger/orderer/msp
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer5.example.com/tls/:/var/hyperledger/orderer/tls
        - orderer5.example.com:/var/hyperledger/production/orderer
    ports:
    - 7050:7050

  couchdb5:
    container_name: couchdb5
    image: hyperledger/fabric-couchdb
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    # Comment/Uncomment the port mapping if you want to hide/expose the CouchDB service,
    # for example map it to utilize Fauxton User Interface in dev environments.
    ports:
      - "11984:5984"
    networks:
      - byfn

  peer0.org5.example.com:
    container_name: peer0.org5.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org5.example.com
    environment:
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb5:5984
      # The CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME and CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD
      # provide the credentials for ledger to connect to CouchDB.  The username and password must
      # match the username and password set for the associated CouchDB.
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    networks:
      - byfn
```

### .env
```
COMPOSE_PROJECT_NAME=net
IMAGE_TAG=latest
SYS_CHANNEL=byfn-sys-channel
```

### host1~5 shellScript
```
export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.example.com/ca && ls *_sk)
docker-compose -f host1~5.yaml up -d
```


이제 host1에 모든 것이 있습니다. 이 디렉토리를 다른 모든 호스트에 복사합니다. EC2에서 파일을 복사할 수 없으므로 로컬 호스트를 "브리지"로 사용하겠습니다.
```
# < HOST1에서 >
cd ../fabric-samples
tar cf raft-5node-swarm.tar raft-5node-swarm/




-----------------------
# < HOST1 >종료 후 < key가 있는 내 컴퓨터 >에서
1. 내 local로 HOST1 서버에 있는 압축파일 가져오기
scp -i <key> ubuntu@<Host 1 IP>:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples/raft-5node-swarm.tar .

2. 각 호스트로 압축파일 내보내기
scp -i <key> raft-5node-swarm.tar ubuntu@<Host 2, 3, 4 and 5 IP>:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples

ex)
1. key가 있는 내 컴퓨터로 HOST1 서버에 있는 압축파일 가져오기
scp -i blockchain_key.pem ubuntu@54.180.58.25:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples/raft-5node-swarm.tar .

2. 각 호스트로 압축파일 내보내기 host2~5 반복
scp -i blockchain_key.pem raft-5node-swarm.tar ubuntu@13.209.56.166:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples
scp -i blockchain_key.pem raft-5node-swarm.tar ubuntu@<host3 IP>:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples
scp -i blockchain_key.pem raft-5node-swarm.tar ubuntu@<host4 IP>:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples
scp -i blockchain_key.pem raft-5node-swarm.tar ubuntu@<host5 IP>:/home/ubuntu/go/src/github.com/hyperledger/fabric-samples
----------------------




# < HOST 2, 3, 4 and 5 > 에서 tar 압축풀기
cd /fabric-samples
tar xf raft-5node-swarm.tar
cd raft-5node-swarm
```

![image](https://user-images.githubusercontent.com/54825978/127282548-b655fc9d-b88e-434f-a158-293ca0fe45d4.png)

이제 모든 노드에 동일한 암호화 자료와 필수 docker-compose 파일이 있습니다. 모든 컨테이너를 가져올 준비가 되었습니다.

## 4단계 : 각 node에서 컨테이너 불러오기
docker-compose를 사용하여 모든 호스트를 불러옵니다.
```
# host 1, 2, 3, 4, 5에서 해당 yaml 파일을 불러옵니다.
 docker-compose -f host1~5.yaml up -d
```

![image](https://user-images.githubusercontent.com/54825978/127289333-26b830fa-28b8-4ccd-8411-ebb0bbf2da2e.png)
오류 발생 시

### ERROR: manifest for hyperledger/fabric-orderer:latest not found
```
# fabric-tools 최신 버전으로 pull
sudo docker pull hyperledger/fabric-orderer:x86_64-1.1.0-rc1
# tag 수정
sudo docker tag hyperledger/fabric-orderer:x86_64-1.1.0-rc1 hyperledger/fabric-tools:latest
```
### ERROR: manifest for hyperledger/fabric-tools:latest not found
```
# fabric-tools 최신 버전으로 pull
sudo docker pull hyperledger/fabric-tools:x86_64-1.1.0-rc1
# tag 수정
sudo docker tag hyperledger/fabric-tools:x86_64-1.1.0-rc1 hyperledger/fabric-tools:latest
```
### ERROR: manifest for hyperledger/fabric-peer:latest not found
```
# fabric-peer 최신 버전으로 pull
sudo docker pull hyperledger/fabric-peer:x86_64-1.1.0-rc1
# tag 수정
sudo docker tag hyperledger/fabric-peer:x86_64-1.1.0-rc1 hyperledger/fabric-peer:latest
```
/base/docker-compose-base의 orderer에 다음 명령어 추가
![image](https://user-images.githubusercontent.com/54825978/127632612-ee941ac0-50d0-48e4-8c20-adcd9aaf2142.png)
```
image: hyperledger/fabric-orderer:latest
```

</br>
host1~5에 peer 1개씩, orderer 1개씩</br>
host1에 모든 node에 명령을 위한 cli.

![image](https://user-images.githubusercontent.com/54825978/127805050-f1f4cfeb-448c-4c6f-a5aa-86a594040c0e.png)



## 5단계 : 채널을 만들고 모든 피어 노드 결합
호스트 1에는 CLI만 있으므로 모든 명령은 호스트 1 터미널에서 실행됩니다. </br></br>
mychannel 에 대한 채널 생성 블록을 생성합니다 .
```
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```
![image](https://user-images.githubusercontent.com/54825978/128439642-1b7ff1d1-6c5c-4d84-bd63-f57022c19196.png)


mychannel에 peer0.org1 가입
```
docker exec cli peer channel join -b mychannel.block
```
![image](https://user-images.githubusercontent.com/54825978/128439714-b97fcc38-9777-4dc8-9dcc-27c08f55e13b.png)


mychannel에 peer0.org2 가입
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp -e CORE_PEER_ADDRESS=peer0.org2.example.com:8051 -e CORE_PEER_LOCALMSPID="Org2MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt cli peer channel join -b mychannel.block
```
mychannel에 peer0.org3 가입
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp -e CORE_PEER_ADDRESS=peer0.org3.example.com:9051 -e CORE_PEER_LOCALMSPID="Org3MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt cli peer channel join -b mychannel.block
```
mychannel에 peer0.org4 가입
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp -e CORE_PEER_ADDRESS=peer0.org4.example.com:10051 -e CORE_PEER_LOCALMSPID="Org4MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt cli peer channel join -b mychannel.block
```
mychannel에 peer0.org5 가입
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/users/Admin@org5.example.com/msp -e CORE_PEER_ADDRESS=peer0.org5.example.com:11051 -e CORE_PEER_LOCALMSPID="Org5MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt cli peer channel join -b mychannel.block
```




## 6단계 : Fabcar 체인코드 설치 및 인스턴스화
HOST1에서 작업 </br>

모든 피어 노드에 Fabcar 체인코드 설치

peer0.org1
```
docker exec cli peer chaincode install -n fabcar -v 1.0 -p github.com/chaincode/fabcar/go/
```


peer0.org2
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp -e CORE_PEER_ADDRESS=peer0.org2.example.com:8051 -e CORE_PEER_LOCALMSPID="Org2MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt cli peer chaincode install -n fabcar -v 1.0 -p github.com/chaincode/fabcar/go/
```

peer0.org3
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp -e CORE_PEER_ADDRESS=peer0.org3.example.com:9051 -e CORE_PEER_LOCALMSPID="Org3MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt cli peer chaincode install -n fabcar -v 1.0 -p github.com/chaincode/fabcar/go/
```

peer0.org4
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp -e CORE_PEER_ADDRESS=peer0.org4.example.com:10051 -e CORE_PEER_LOCALMSPID="Org4MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt cli peer chaincode install -n fabcar -v 1.0 -p github.com/chaincode/fabcar/go/
```

peer0.org5
```
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/users/Admin@org5.example.com/msp -e CORE_PEER_ADDRESS=peer0.org5.example.com:11051 -e CORE_PEER_LOCALMSPID="Org5MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt cli peer chaincode install -n fabcar -v 1.0 -p github.com/chaincode/fabcar/go/
```

mychannel 에 Fabcar 체인코드를 인스턴스화합니다.
```
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n fabcar -v 1.0 -c '{"Args":[]}' -P "OutOf (3, 'Org1MSP.peer', 'Org2MSP.peer', 'Org3MSP.peer', 'Org4MSP.peer', 'Org5MSP.peer')"
```

## 7단계 : 체인코드 호출 및 쿼리
```
docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n fabcar --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:8051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses peer0.org3.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt --peerAddresses peer0.org4.example.com:10051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt --peerAddresses peer0.org5.example.com:11051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt -c '{"Args":["initLedger"]}'
```

(선택사항) 그 후 4개의 피어 노드에서 자동차 레코드를 쿼리할 수 있습니다. 이것은 패브릭 네트워크가 잘 작동하고 있음을 보여줍니다.
```
# from peer0.org1
docker exec cli peer chaincode query -n fabcar -C mychannel -c '{"Args":["queryCar","CAR0"]}'

# from peer0.org2
docker exec -e CORE_PEER_ADDRESS=peer0.org2.example.com:8051 -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt cli peer chaincode query -n fabcar -C mychannel -c '{"Args":["queryCar","CAR0"]}'

# from peer0.org3
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp -e CORE_PEER_ADDRESS=peer0.org3.example.com:9051 -e CORE_PEER_LOCALMSPID="Org3MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt cli peer chaincode query -n fabcar -C mychannel -c '{"Args":["queryCar","CAR0"]}'

# from peer0.org4
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp -e CORE_PEER_ADDRESS=peer0.org4.example.com:10051 -e CORE_PEER_LOCALMSPID="Org4MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt cli peer chaincode query -n fabcar -C mychannel -c '{"Args":["queryCar","CAR0"]}'

# from peer0.org5
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/users/Admin@org5.example.com/msp -e CORE_PEER_ADDRESS=peer0.org5.example.com:11051 -e CORE_PEER_LOCALMSPID="Org5MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org5.example.com/peers/peer0.org4.example.com/tls/ca.crt cli peer chaincode query -n fabcar -C mychannel -c '{"Args":["queryCar","CAR0"]}'
```

## 8단계 : 정리
```
# 각 호스트
 docker-compose -f host n .yaml down -v
```


# ✅ 6. ec2 웹 서버

## 1단계 : connection.yaml 수정
![image](https://user-images.githubusercontent.com/54825978/129148630-e3b1285c-d6b7-4f56-8cb8-3317d23d3c9b.png)

## 2단계 : Nginx
https://velog.io/@jeff0720/2018-11-18-2111-%EC%9E%91%EC%84%B1%EB%90%A8-iojomvsf0n
## 설치
```
sudo apt-get update
sudo apt-get install nginx
```
## Nginx 디렉터리 이동
```
cd /etc/nginx/sites-available
```
### Nginx 디렉터리 의미
- /etc/nginx: 해당 디렉터리는 Nginx를 설정하는 디렉터리입니다.모든 설정을 이 디렉터리 안에서 합니다.
- /etc/nginx/nginx.conf: Ngnix의 메인 설정 파일로 Nginx의 글로벌 설정을 수정 할 수 있습니다.
- /etc/nginx/sites-available: 해당 디렉터리에서 프록시 설정 및 어떻게 요청을 처리해야 할지에 대해 설정 할 수 있습니다.
- /etc/nginx/sites-enabled: 해당 디렉터리는 sites-available 디렉터리에서 연결된 파일들이 존재하는 곳 입니다.이 곳에 디렉터리와 연결이 되어 있어야 nginx가 프록시 설정을 적용합니다.
- /etc/nginx/snippets: sites-available 디렉터리에 있는 파일들에 공통적으로 포함될 수 있는 설정들을 정의할 수 있는 디렉터리 입니다.

## node-server 수정
```
sudo vi node-server
```
```
server {
        listen 80;
        server_name 13.209.56.166;  // Org1~5 각각 자신의 주소로
        location / {
                proxy_pass http://127.0.0.1:4200;
                # Allow the use of websockets
                proxy_http_version 1.1;
                proxy_set_header   X-Forwarded-For $remote_addr;
                proxy_set_header   Host $http_host;
                proxy_set_header   Upgrade $http_upgrade;
                proxy_set_header   Connection "upgrade";
                proxy_cache_bypass $http_upgrade;
        }
}

클라이언트가 54.180.102.122:80/ 주소로 요청하면 현재 서버에서 실행되고 있는 http://127.0.0.1:4200 으로 클라이언트의 요청을 대신 보내준다는 의미
```

## node-server(파일명) 파일 연결
```
sudo ln -s /etc/nginx/sites-available/node-server /etc/nginx/sites-enabled/
```

## 재시작
```
sudo systemctl restart nginx
```






# ✅ 7. 클라이언트
## Proxy 수정
### Client proxy 	(Org1~5 각각 자신의 주소로 수정)
자기 자신을 가르킬 것 
ex) 		"target": "http://13.124.175.72:8081"

### api.service.ts (Org1~5 각각 자신의 주소로 수정)
client/src/app/api.service.ts	const baseURL = `http://13.124.175.72:8081`;



# ✅ 8. pm2 클라이언트 / 서버 실행
```
# pm2 설치
npm install -g pm2@latest

# 클라이언트 실행
pm2 start npm --name "Client" -- start

# 서버 실행
pm2 start npm --name "Server" -- start

# log 확인
pm2 monit

# pm2 kill
pm2 kill
```



# ✅ 9. hyperledger explorer
공식문서 https://github.com/hyperledger/blockchain-explorer

## 1단계 : 도커 이미지 다운로드
https://hub.docker.com/r/hyperledger/explorer/    </br>
https://hub.docker.com/r/hyperledger/explorer-db
```
docker pull hyperledger/explorer
```
```
docker pull hyperledger/explorer-db
```

## 2단계 : PostgreSQL 설치
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## 3단계 : Hyperledger Fabric 네트워크 실행

## 4단계 : 구성
$ raft-5node-swarm/docker-compose.yaml </br>
$ raft-5node-swarm/config.json </br>
$ raft-5node-swarm/connection-profile/first-network.json </br>

### docker-compose.yaml
```
# SPDX-License-Identifier: Apache-2.0
version: '2.1'

volumes:
  pgdata:
  walletstore:

networks:
  byfn:
    external:
      name: first-network

services:

  explorerdb.mynetwork.com:
    image: hyperledger/explorer-db:latest
    container_name: explorerdb.mynetwork.com
    hostname: explorerdb.mynetwork.com
    environment:
      - DATABASE_DATABASE=fabricexplorer
      - DATABASE_USERNAME=hppoc
      - DATABASE_PASSWORD=password
    healthcheck:
      test: "pg_isready -h localhost -p 5432 -q -U postgres"
      interval: 30s
      timeout: 10s
      retries: 5
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - byfn

  explorer.mynetwork.com:
    image: hyperledger/explorer:latest
    container_name: explorer.mynetwork.com
    hostname: explorer.mynetwork.com
    environment:
      - DATABASE_HOST=explorerdb.mynetwork.com
      - DATABASE_DATABASE=fabricexplorer
      - DATABASE_USERNAME=hppoc
      - DATABASE_PASSWD=password
      - LOG_LEVEL_APP=debug
      - LOG_LEVEL_DB=debug
      - LOG_LEVEL_CONSOLE=info
      - LOG_CONSOLE_STDOUT=true
      - DISCOVERY_AS_LOCALHOST=false
    volumes:
      - ./config.json:/opt/explorer/app/platform/fabric/config.json
      - ./connection-profile:/opt/explorer/app/platform/fabric/connection-profile
      - ./crypto-config:/tmp/crypto
      - walletstore:/opt/explorer/wallet
    ports:
      - 8080:8080
    depends_on:
      explorerdb.mynetwork.com:
        condition: service_healthy
    networks:
      - byfn
```

### config.json
```
{
        "network-configs": {
                "first-network": {
                        "name": "first-network",
                        "profile": "./connection-profile/first-network.json"
                }
        },
        "license": "Apache-2.0"
}
```

### connection-profile/first-network.json
```
{
        "name": "first-network",
        "version": "1.0.0",
        "client": {
                "tlsEnable": true,
                "adminCredential": {
                        "id": "exploreradmin",
                        "password": "exploreradminpw"
                },
                "enableAuthentication": true,
                "organization": "Org1MSP",
                "connection": {
                        "timeout": {
                                "peer": {
                                        "endorser": "300"
                                },
                                "orderer": "300"
                        }
                }
        },
        "channels": {
                "mychannel": {
                        "peers": {
                                "peer0.org1.example.com": {}
                        }
                }
        },
        "organizations": {
                "Org1MSP": {
                        "mspid": "Org1MSP",
                        "adminPrivateKey": {
                                "path": "/tmp/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/3217e77a01fda41ef46ce3945b55cdc99e748a00de1f7d132ef76f2fc79b6c2a_sk"
                        },
                        "peers": ["peer0.org1.example.com"],
                        "signedCert": {
                                "path": "/tmp/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
                        }
                }
        },
        "peers": {
                "peer0.org1.example.com": {
                        "tlsCACerts": {
                                "path": "/tmp/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
                        },
                        "url": "grpcs://peer0.org1.example.com:7051"
                }
        }
}
```

## 5단계 : explorer 시작
```
docker-compose -f docker-compose.yaml up -d
```
explorer.mynetwork.com Exited(1) 되는 문제가 발생하면
![image](https://user-images.githubusercontent.com/54825978/130168989-1e8c56c4-81f7-43bf-9e40-4960449471d7.png)
```
docker stop explorerdb.mynetwork.com
docker rm explorerdb.mynetwork.com
```


## 6단계 : explorer 진입
```
13.209.56.166:8080
```

## 7단계 : explorer 종료
```
docker-compose -f docker-compose.yaml down -v
```




# ✅ 10. MongoDB 설치
### 환경 ( AWS Ubuntu 20.04 LTS)

## 1단계 : 터미널에서 MongoDB 공개 GPG 키를 가져오도록 합니다.
```
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```
## 2단계 : 터미널에 다음 명령어 입력
```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```
## 3단계 : MongoDB를 위한 list 파일을 로컬 패키지 데이터베이스에 추가했기 때문에 로컬 패키지 데이터베이스를 업데이트합니다.
```
sudo apt update
```
## 4단계 : MongoDB 패키지 설치 (둘 중 선택)
1. 최신 안정화 버전
```
sudo apt install -y mongodb-org
```
2. 특정 릴리즈 버전
```
sudo apt install -y mongodb-org=4.4.2 mongodb-org-server=4.4.2 mongodb-org-shell=4.4.2 mongodb-org-mongos=4.4.2 mongodb-org-tools=4.4.2
```
## 5단계 : 실행
```
sudo systemctl start mongod
```

## 6단계 : 계정 생성
'mongo'를 입력해 MongoDB 접속
```
mongo
```
관리자 생성
```
use admin
db.createUser({ user: "사용자 계정",
  pwd: "패스워드",
  roles: [ "userAdminAnyDatabase",
    "dbAdminAnyDatabase",
    "readWriteAnyDatabase"
  ]
})
```
DB 계정 생성
```
use customDB
db.createUser({ user: "계정",
  pwd: "패스워드",
  roles: ["dbAdmin", "readWrite"]
})
```
## 7단계 : 보안 설정
MongoDB 설정 수정
```
sudo vi /etc/mongod.conf
```
bindIp를 주석처리하면 bindIp에 나열된 ip가 아니더라도 MongoDB에 접근할 수 있습니다. 우리는 EC2 Security Group에서 접근을 제어하기 때문에 bindIp옵션을 주석처리합니다.
```
# network interfaces
net:
  port: 27017
  #bindIp: 127.0.0.1
```
같은 파일의 security 옵션을 주석해제하고, authorization: enabled옵션을 추가합니다. 이 옵션을 설정하면 MongoDB에 익명으로 로그인할 수 없습니다.
```
security:
    authorization: enabled
```
변경 사항 적용
```
service mongod restart
```
## 8단계 : EC2 Security Group 설정
EC2 Instance에 설정된 Security Group의 inbound rule에 MongoDB 포트를 열어줍니다. 포트를 변경하지 않으셨다면 27017번이 기본 MongoDB 포트입니다.</br>
Source는 DB에 접근하는 서버의 ip 혹은 현재 작업하는 위치의 ip로 설정합니다. 현재 작업 위치가 신뢰할 수 없는 네트워크일 경우, 작업이 끝난 뒤 해당 rule을 삭제하는 것이 안전합니다.



# ✅ 11. git personal access token 
## Linux 기반 OS용 ⤴
Linux의 경우 사용자 이름과 이메일 주소로 로컬 GIT 클라이언트를 구성해야 합니다.

$ git config --global user.name "your_github_username"
$ git config --global user.email "your_github_email"
$ git config -l
GIT가 구성되면 이를 사용하여 GitHub에 액세스할 수 있습니다. 예 :

$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
> Cloning into `Spoon-Knife`...
$ Username for 'https://github.com' : username
$ Password for 'https://github.com' : give your personal access token here
이제 토큰을 기억하기 위해 컴퓨터에 지정된 레코드를 캐시합니다.

$ git config --global credential.helper cache
필요한 경우 언제든지 다음을 통해 캐시 레코드를 삭제할 수 있습니다.

$ git config --global --unset credential.helper
$ git config --system --unset credential.helper
이제 로 당겨 -v확인하십시오.

$ git pull -v



