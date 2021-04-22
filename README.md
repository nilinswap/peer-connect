# peer-connect
A webrtc chat app made using peerjs. hosted [here](https://nilinswap.github.io/peer-connect/)

# Run locally
open file://<abs-path-to-project-container>/peer-connect/index.html in browser in two tabs. Open console, connect one tab to other and see them talking.


## Hooks?
- solve echo problem

- create design for auto-connect (without peer-id)

- create api design

- how can you provision this using a single javascript?

- How to bring in authentication

- Try multiple peer connect

## commands

1. check what all ports are process using - 
```shell
netstat -tulpn
```

2. run turnserver manually
```shell
sudo turnserver -c /etc/turnserver.conf
```

3. manage turn server
```shell
sudo systemctl stop/start/restart coturn
```

4. check logs
```shell
   journalctl -fue coturn 
```

5. create new turn users
```shell
sudo turnadmin -a -u <username> -r <realm> -p <password>
```
in my case realm was `myturn.codes`

## Don't forget
1. `/etc/turnserver.conf` is where conf file is.
2. `/etc/default/coturn` is used to have server running from start of the server.

## Some Language

IPH - Iske Paise Hai

## Resources

1. [webrtc connectivity usecases](https://blog.addpipe.com/troubleshooting-webrtc-connection-issues/)
2. running your own coturn server in ec2. Mostly [this](https://medium.com/@omidborjian/setup-your-own-turn-stun-signal-relay-server-on-aws-ec2-78a8bfcb71c3) and also [this.](https://medium.com/swlh/setup-your-own-coturn-server-using-aws-ec2-instance-29303101e7b5)
3. [Trickle](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)

## stack-overflowed

1. [webrtc open ports](https://stackoverflow.com/questions/59193091/which-ports-should-be-allowed-in-firewall-to-use-turn-server#59212004)
2. [ami image for coturn?](https://stackoverflow.com/questions/43284758/coturn-server-relay-is-not-working)
3. [is webrtc using turn?](https://stackoverflow.com/questions/18177093/how-to-check-if-webrtc-uses-a-relay-server)
4. [dh-pem](https://github.com/coturn/coturn/issues/629)