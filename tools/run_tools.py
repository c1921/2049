import subprocess
import sys
import os

def run_tool(script_name, input_dir, output_dir):
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    result = subprocess.run([sys.executable, script_path, input_dir, output_dir], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {script_name}: {result.stderr}")
        sys.exit(result.returncode)
    else:
        print(f"Output from {script_name}:\n{result.stdout}")

if __name__ == "__main__":
    # 定义统一的输入和输出文件夹
    input_dir = os.path.join(os.path.dirname(__file__), '..', 'original_content')
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'dialogues')

    # 先运行第一个工具
    print("Running Tool 1...")
    run_tool('tool1.py', input_dir, output_dir)

    # 然后运行第二个工具
    print("Running Tool 2...")
    run_tool('tool2.py', input_dir, output_dir)
