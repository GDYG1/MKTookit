import random

def generate_ssq(num_sets=10000000, output_file="data.txt"):
    with open(output_file, "w") as f:
        for _ in range(num_sets):
            # red = sorted(random.sample(range(1, 36), 5))
            # blue = sorted(random.sample(range(1, 12), 2))
            red = sorted(random.sample(range(1, 34), 6))
            blue = random.randint(1, 16)
            f.write(f"{' '.join(map(str, red))} | {blue}\n")

generate_ssq()
