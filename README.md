##ISO Country Code Checker
1. Query list of country that are in DB
2. Create a text file in directory with each sku name, and copy and paste the entire country code
  EX. EXXAMPLE-E-V-STD.txt

3. If there is any additional country needs to be added, run cleanup.js after adding a few county names. (make sure iso.txt has the same county name and code as well.)
```
node cleanup.js needs_to_be_on_list.txt iso.txt

//DEBUG mode
DEBUG=readerApp* node cleanup.js needs_to_be_on_list.txt iso.txt
```
This should give you a list of countries that are not in the DB, but listed in the ISO list from https://www.cbp.gov/sites/default/files/assets/documents/2016-Oct/ACE%20AESTIR%20Appendix%20C%20-%20October%202016.pdf
http://www.nationsonline.org/oneworld/country_code_list.htm
Some country code were not listed in above links, so you may have to do a little research..


4. run in your terminal. This will spit out a new file in the new dated directory.
```
node reader.js requests_12_22_16 EXAMPLE-E-V-STD.txt needs_to_be_on_list.txt
// node reader.js directory_with_date_of_request request_file.txt needs_to_be_on_list.txt

//DEBUG mode
DEBUG=readerApp* reader.js requests_12_22_16 EXAMPLE-E-V-STD.txt needs_to_be_on_list.txt
```
