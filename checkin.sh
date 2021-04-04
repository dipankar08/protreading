echo ">>>>>> Liniting python backend ......"
cd backend;pyright;cd -

git pull
git add --all
git commit -m "automated chkin"
git push origin master
