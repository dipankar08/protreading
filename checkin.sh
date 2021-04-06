echo ">>>>>> Liniting python backend ......"
cd backend;pipenv shell pyright;cd -

git pull
git add --all
git commit -m "automated chkin"
git push origin master
