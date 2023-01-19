import hashlib


def crack_sha1_hash(hash, use_salts=False):
    print(hash, use_salts)
    with open("top-10000-passwords.txt", mode="r") as password_file:
        passwords = password_file.readlines()
        passwords = tuple(p.strip() for p in passwords)
        for password in passwords:
            p_crack = hashlib.sha1()
            p_crack.update(password.encode("utf-8"))
            cracked_password_hash = p_crack.hexdigest()
            if cracked_password_hash == hash:
                print(password)
                return password
