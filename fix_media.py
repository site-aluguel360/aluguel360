import json
from pathlib import Path

seeds_file = Path('c:/Users/LAB_01/Documents/VSCODE/aluguel360/aluguel360/SEEDS/seeds_banco.json')
imoveis_dir = Path('c:/Users/LAB_01/Documents/VSCODE/aluguel360/aluguel360/SEEDS/SEEDS/imoveis')

with open(seeds_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

for imovel in data['imoveis']:
    seed_id = imovel['seed_id']
    dados_file = imoveis_dir / seed_id / 'dados.json'
    if dados_file.exists():
        with open(dados_file, 'r', encoding='utf-8') as df:
            original_data = json.load(df)
            if 'midias' in original_data:
                imovel['midias'] = original_data['midias']

with open(seeds_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('seeds_banco.json updated with correct media.')
