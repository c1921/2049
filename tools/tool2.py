import json
import os
import re
import sys

def transform_conditions(data):
    edges = data["edges"]
    transformed = {}

    for edge in edges:
        if "label" in edge and edge["label"] == "conditions":
            condition_id = edge["id"]
            from_node_id = edge["fromNode"]
            to_node_id = edge["toNode"]

            # 寻找fromNode的其他连接
            other_connections = [e["toNode"] for e in edges if e["fromNode"] == from_node_id and e["id"] != condition_id]

            # 如果没有找到另一个连接，跳过此项
            if not other_connections:
                continue

            # 生成新结构
            transformed[condition_id] = {
                "id": condition_id,
                "text": [],
                "next": "",
                "conditions": [
                    {
                        "check": "(conditionValue: number) => conditionValue === 1",
                        "nextId": to_node_id,
                    },
                    {
                        "check": "(conditionValue: number) => conditionValue !== 1",
                        "nextId": other_connections[0],
                    },
                ],
            }

    return transformed

def format_transformed_data(transformed_data):
    formatted_lines = []
    for key, value in transformed_data.items():
        conditions = value['conditions']
        condition_lines = []
        for condition in conditions:
            check_line = f"check: {condition['check']}"
            next_id_line = f"nextId: \"{condition['nextId']}\""
            condition_lines.append(f"{{\n                {check_line},\n                {next_id_line}\n            }}")
        
        conditions_block = ",\n            ".join(condition_lines)
        block = f"\"{key}\": {{\n        id: \"{value['id']}\",\n        text: [],\n        next: \"\",\n        conditions: [\n            {conditions_block}\n        ]\n    }},"
        formatted_lines.append(block)
    
    return "\n".join(formatted_lines)

def update_previous_nextId(content, new_id, next_id_to_replace):
    # 使用正则表达式查找并替换 nextId 值
    pattern = rf'nextId:\s*"{next_id_to_replace}"'
    updated_content = re.sub(pattern, f'nextId: "{new_id}"', content, count=1)
    return updated_content

def write_to_file(output_file, transformed_data):
    with open(output_file, 'r+', encoding='utf-8') as file:
        content = file.read()

        # 处理每一个要插入的结构
        for key, value in transformed_data.items():
            first_next_id = value["conditions"][0]["nextId"]

            # 更新前文中的 nextId
            content = update_previous_nextId(content, key, first_next_id)

            # 生成要插入的文本
            insert_text = format_transformed_data({key: value})

            # 找到插入位置
            insertion_index = content.rfind("};")
            if insertion_index == -1:
                raise ValueError("File format not as expected. Couldn't find the ending '};'")

            # 插入内容
            content = content[:insertion_index] + insert_text + "\n" + content[insertion_index:]

        # 写回文件
        file.seek(0)
        file.write(content)
        file.truncate()

if __name__ == "__main__":
    # 获取从命令行传递的输入和输出路径
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    # 假设输入目录中已经有生成的 .ts 文件，继续处理
    ts_file = os.path.join(output_dir, 'dialogueAlice.ts')
    
    # 读取原始数据
    data = None
    for filename in os.listdir(input_dir):
        if filename.endswith('.canvas'):
            input_file = os.path.join(input_dir, filename)
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            break

    # 执行转换
    if data:
        transformed_data = transform_conditions(data)
        # 将转换后的数据写入指定文件
        write_to_file(ts_file, transformed_data)
