if [ $# -lt 1 ] || [ $# -gt 2 ] || ([ $# -eq 2 ] && [ "$2" != "--publish" ]); then
    echo "Usage: ./build.sh <version> [--publish]"
    exit 1
fi

if [ -n "$(git tag | grep "$1")" ]; then
    echo -n "Version $1 already exists, overwrite? (y/n): "
    read resp
    if [ "$resp" != "y" ]; then
        echo "Aborted. The most recent version is $(git tag | tac | head -n 1)."
        exit 1
    fi
    overwrite=1
else
    overwrite=0
fi

echo "Building frontend..."
cd frontend || exit 1
npm run build
if [ $? -ne 0 ]; then
    echo "An error occurred while building the frontend. The build was aborted."
    exit 1
fi

echo "Building image..."
cd ..
docker build . -t "jl58261/minicms:$1"
if [ $? -ne 0 ]; then
    echo "An error occurred while building the image. The build was aborted."
    exit 1
fi

if [ "$2" == "--publish" ]; then
    if [ "$overwrite" == "1" ]; then
        echo "Removing previous commit tag..."
        git tag -d "$1"
    fi
    
    echo "Tagging commit..."
    git tag "$1"

    echo "Publishing to GitHub..."
    git push --tags
    
    echo "Publishing to Docker Hub..."
    docker push "jl58261/minicms:$1"
fi

echo "Done."
