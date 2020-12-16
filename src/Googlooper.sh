#!/bin/bash



#launch json server
clear
echo "Starting JSON server..."
json-server assets/research.json &
echo -e "\nJSON server started.\n"
echo "Please remember to close this terminal"
echo -e "in order to end the JSON server.\n"



#get research.json modification time
oldmodif=`stat -c '%y' assets/research.json`



#Googlooper
echo "Googlooper is running..."
while true;
do
	#get modification date
	newmodif=`stat -c '%y' assets/research.json`

	#check if request file has been modified
	if [[ "${newmodif}" != "${oldmodif}" ]]; then
		echo -e "Googlooper > Modification detected !"
		oldmodif="${newmodif}"

		#read data from file
		researchData=`cat assets/research.json`

		#get the concerned line
		researchLine=$(echo  $researchData | tr "
		" " \n")

		#get the request (between '|')
		research=`echo "${researchLine}" | cut -d'|' -f 2`
		echo "Googlooper > Researching \"${research}\"..."

		#searching
		googler --count 10 -c fr --exact --json --noprompt "${research}" > assets/result.json
		echo -e "Googlooper > Research done.\n"
	fi

	#temporize
	sleep 0.25
done
