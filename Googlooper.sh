#!/bin/bash



#get modification time
oldmodif=`stat -c '%y' assets/research.json`



while true;
do
	#get modification date
	newmodif=`stat -c '%y' assets/research.json`

	#check if request file has been modified
	if [[ "${newmodif}" != "${oldmodif}" ]]; then
		echo "modification detected !"
		oldmodif="${newmodif}"

		#read data from file
		researchData=`cat assets/research.json`

		#get the concerned line
		researchLine=`echo "${researchData}" | cut -d'
' -f 2`

		#get the request (between '|')
		research=`echo "${researchLine}" | cut -d'|' -f 2`

		googler -c fr --exact --json --noprompt "${research}" > assets/result.json
	fi

	#temporize
	sleep 0.5
done
