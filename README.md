# Token2 Molto2 CLI Generator

Generates a command line for the Token2 Molto2 device, for use with the `molto2.py` or `molto2-config.exe` CLI utility, given user input as a form field.

<https://andygock.github.io/molto2-cli-generator/>

## References

- [Command Line Configuration Utility for Molto2 - molto2-config.exe](https://www.token2.com/site/page/command-line-configuration-utility-for-molto2-molto2-config-exe)
- [Usage specification of the otpauth URI format for TOTP and HOTP token generators](https://www.ietf.org/archive/id/draft-linuxgemini-otpauth-uri-01.txt)
- [VanillaQR clientside javascript QR code generator JS library](https://github.com/chuckfairy/VanillaQR.js/)

`molto2.py` usage parameters

```txt
usage: molto2.py [-h] [--key KEY] [--keyascii KEYASCII] [--profile PROFILE] [--title TITLE] [--seed SEED] [--seedbase32 SEEDBASE32] [--setkey SETKEY] [--setkeyascii SETKEYASCII] [--config]
                     [--display_timeout DISPLAY_TIMEOUT] [--algorithm ALGORITHM] [--timestep TIMESTEP] [--factoryreset]

    optional arguments:
      -h, --help            show this help message and exit
      --key KEY             Customer key in hex format. Default will be used if not supplied.
      --keyascii KEYASCII   Customer key in ascii format. Default will be used if not supplied.
      --profile PROFILE     Profile number, from 0 to 49 (Molto2) or from 0 to 99 (Molto2 v2)
      --title TITLE         Profile title, 12 chars max
      --seed SEED           Seed to write, in hex format
      --seedbase32 SEEDBASE32
                            Seed to write, in base32 format
      --setkey SETKEY       Set the new customer key, providing the key in hex. Please note that setting new key requires confirmation on the device (physical button press)
      --setkeyascii SETKEYASCII
                            Set the new customer key, providing key in ascii. Please note that setting new key requires confirmation on the device (physical button press)
      --config              If config parameter is set, the config parameters become required.
      --display_timeout DISPLAY_TIMEOUT
                            mandatory if --config is set as 1. Possible values 0=15s, 1=30s, 2=60s, 3=120s
      --algorithm ALGORITHM
                            mandatory if --config is set as 1. Possible values 1=SHA1 HMAC or 2=SHA256 HMAC hashing algorithm
      --timestep TIMESTEP   mandatory if --config is set as 1. Possible values 1=30 seconds or 2= 60 seconds
      --factoryreset        Resets the device to factory setting and clear all data. Please note this requires confirmation on the device (physical button press)
      --synctime            Will update time on the given profile. Should be used together with --profile parameter
      --synctimeall         Will update time on all profiles.
      --lock                Lock device screen (only for v2.1 and higher)
      --unlock              Unlock device screen (only for v2.1 and higher)
```
