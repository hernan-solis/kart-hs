#!/bin/bash
cd "$(dirname "$0")"
echo "======================================================="
echo "   SUBIENDO PROYECTO A GITHUB: Kart-HS                "
echo "======================================================="

# Verificar si tiene el repositorio remoto configurado
if ! git remote | grep -q 'origin'; then
    echo "Configurando repositorio remoto en GitHub..."
    git remote add origin https://github.com/hernan-solis/kart-hs.git
fi

git add .
echo "Ingresa un mensaje para el commit (o presiona ENTER para usar 'Actualización'):"
read -r commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Actualización del campeonato Kart-HS"
fi

git commit -m "$commit_msg"
echo ""
echo "Enviando cambios a GitHub (rama main)..."
git push -u origin main
echo ""
echo "Operación finalizada. Podés cerrar esta ventana."
read -p "Presiona ENTER para salir..."
