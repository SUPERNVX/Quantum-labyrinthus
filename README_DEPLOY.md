# 🚀 INSTRUÇÕES DE DEPLOY - GitHub Pages

## ⚠️ CONFIGURAÇÃO OBRIGATÓRIA (Faça Agora!)

Para o site funcionar corretamente, você **DEVE** configurar o GitHub Pages:

### Passo a Passo:

1. **Acesse seu repositório no GitHub:**
   ```
   https://github.com/SUPERNVX/Quantum-labyrinthus
   ```

2. **Vá em Settings → Pages:**
   - Clique em **Settings** (Configurações) no topo
   - No menu lateral esquerdo, clique em **Pages**

3. **Configure o Source (MUITO IMPORTANTE!):**
   - Em **Build and deployment**
   - Em **Source**, selecione: **`GitHub Actions`**
   - ⚠️ **NÃO selecione "Deploy from a branch"!**
   - Deve ficar assim:
     ```
     Source: GitHub Actions
     ```

4. **Salve e aguarde:**
   - A página vai recarregar
   - Vá para a aba **Actions** do repositório
   - Você verá um workflow rodando chamado "Deploy to GitHub Pages"
   - Aguarde ele terminar (bolinha verde ✅)

5. **Acesse seu site:**
   ```
   https://supernvx.github.io/Quantum-labyrinthus/
   ```

---

## 🎯 Por que estava dando erro?

Os erros aconteciam porque:
- ❌ O GitHub Pages estava tentando servir da raiz do repositório
- ❌ Mas os arquivos estavam na pasta `dist`
- ✅ Agora o GitHub Actions faz o build e deploy automaticamente da pasta `dist`

---

## 📝 Para Futuros Deploys

Agora é **AUTOMÁTICO**! Sempre que você fizer push para `main`:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

O GitHub Actions vai:
1. ✅ Instalar dependências
2. ✅ Fazer build (`npm run build`)
3. ✅ Criar `.nojekyll`
4. ✅ Deploy automático

---

## 🔍 Como Verificar se Funcionou

1. Vá em **Actions** no GitHub
2. Veja o workflow "Deploy to GitHub Pages"
3. Deve estar com ✅ verde
4. Acesse: https://supernvx.github.io/Quantum-labyrinthus/

---

## 💡 Dica

Se ainda aparecer tela branca:
- Aguarde 1-2 minutos (GitHub precisa processar)
- Limpe o cache do navegador: **Ctrl + Shift + R**
- Verifique se o workflow no Actions terminou com sucesso
