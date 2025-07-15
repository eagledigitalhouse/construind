# Como Substituir o Mapa do Evento

## Passo 1: Converter o PDF para Imagem

1. **Abra seu PDF do mapa** em um conversor online ou software:
   - **Online (Recomendado)**: 
     - PDF24: https://tools.pdf24.org/pt/pdf-para-png
     - SmallPDF: https://smallpdf.com/pt/pdf-para-jpg
     - ILovePDF: https://www.ilovepdf.com/pt/pdf-para-jpg
   
   - **Software Desktop**:
     - Adobe Acrobat
     - GIMP (gratuito)
     - Photoshop

2. **Configurações recomendadas**:
   - **Formato**: PNG (para melhor qualidade) ou JPG
   - **Resolução**: 300 DPI ou superior
   - **Tamanho**: Largura mínima de 1200px

## Passo 2: Substituir o Arquivo

1. **Salve a imagem** na pasta `public/` do projeto
2. **Renomeie o arquivo** para `mapa-evento.png` (ou `.jpg`)
3. **Edite o arquivo** `src/pages/ExpositorPage.tsx`
4. **Substitua a linha** que contém:
   ```tsx
   mapImage="/mapa-placeholder.svg"
   ```
   Por:
   ```tsx
   mapImage="/mapa-evento.png"
   ```

## Passo 3: Testar

1. Execute o projeto: `npm run dev`
2. Navegue até a seção "Mapa do Evento"
3. Teste as funcionalidades de zoom e navegação

## Funcionalidades Disponíveis

O visualizador de mapa oferece:

✅ **Zoom**: Use a roda do mouse ou os botões `+` e `-`
✅ **Navegação**: Clique e arraste para mover o mapa
✅ **Centralizar**: Duplo clique ou botão de reset
✅ **Tela cheia**: Botão para visualização em tela cheia
✅ **Download**: Botão para baixar a imagem do mapa
✅ **Responsivo**: Funciona em desktop e mobile

## Exemplo de Uso

Se você quiser usar um mapa diferente ou adicionar múltiplos mapas:

```tsx
<MapViewer 
  mapImage="/seu-mapa.png"
  title="Título Personalizado"
  description="Descrição personalizada do mapa"
/>
```

## Dica Extra

Para melhor performance, você pode:
1. Otimizar a imagem usando ferramentas como TinyPNG
2. Usar formatos WebP para imagens menores
3. Considerar múltiplas resoluções para diferentes dispositivos

## Problemas Comuns

**Imagem não carrega**: Verifique se o arquivo está na pasta `public/`
**Imagem borrada**: Aumente a resolução do arquivo original
**Zoom muito lento**: Reduza o tamanho do arquivo da imagem

---

**Nota**: O placeholder atual é apenas ilustrativo. Substitua pela imagem real do seu evento. 