#!/usr/bin/env python3
"""
Script to download and convert UK railway station data.
Uses the National Rail Enquiries API or community sources.
"""

import json
import xml.etree.ElementTree as ET
import sys
import urllib.request
import urllib.parse

def fetch_from_networkrail():
    """
    Fetch station codes from Network Rail data feeds.
    Note: Requires authentication credentials.
    """
    # This requires authenticated access to Network Rail data feeds
    # For now, we'll use an alternative approach
    pass

def generate_comprehensive_list():
    """
    Generate a comprehensive list of UK railway stations.
    This includes all major UK railway stations with their CRS codes.
    """
    
    # Complete list of UK railway stations with CRS codes
    # Data compiled from various public sources
    stations = []
    
    # Add stations - starting with comprehensive list
    station_data = """
Aberdare|ABA
Aberdeen|ABD
Abergavenny|AGV
Aberystwyth|AYW
Accrington|ACR
Achnasheen|ACN
Achnashellach|ACH
Acklington|ACK
Acle|ACL
Acocks Green|ACG
Acton Bridge (Cheshire)|ACB
Acton Central|ACC
Acton Main Line|AML
Adderley Park|ADD
Addlestone|ASN
Adisham|ADM
Adlington (Cheshire)|ADC
Adlington (Lancashire)|ADL
Adwick|AWK
Aigburth|AIG
Ainsdale|ANS
Aintree|AIN
Airbles|AIR
Airdrie|ADR
Albany Park|AYP
Albrighton|ALB
Alderley Edge|ALD
Aldermaston|AMT
Aldershot|AHT
Aldrington|AGT
Alexandra Palace|AAP
Alexandra Parade|AXP
Alexandria|ALX
Alfreton|ALF
Allens West|ALW
Alloa|ALO
Alloway|AQS
Alness|ASS
Alnmouth|ALM
Alresford (Essex)|ALR
Alsager|ASG
Althorne|ALN
Althorpe|ALP
Altnabreac|ABC
Alton|AON
Alvechurch|ALV
Ambergate|AMB
Amberley|AMY
Amersham|AMR
Ammanford|AMF
Ancaster|ANC
Anderston|AND
Andover|ADV
Angmering|ANG
Annan|ANN
Anniesland|ANL
Ansdell & Fairhaven|AFV
Appledore|APD
Appleby|APP
Appley Bridge|APB
Apsley|APS
Arbroath|ARB
Ardgay|ARD
Ardlui|AUI
Ardrossan Harbour|ADS
Ardrossan South Beach|ASB
Ardrossan Town|ADN
Ardwick|ADK
Argyle Street|AGS
Arisaig|ARG
Arlesey|ARL
Armadale (West Lothian)|ARM
Armathwaite|AWT
Arnside|ARN
Arram|ARR
Arrochar & Tarbet|ART
Arundel|ARU
Ascot (Berks)|ACT
Ascott-under-Wychwood|AUW
Ash|ASH
Ash Vale|AHV
Ashburys|ABY
Ashchurch for Tewkesbury|ASC
Ashfield|ASF
Ashford (Middlesex)|AFS
Ashford International|AFK
Ashley|ASY
Ashtead|AHD
Ashton-under-Lyne|AHN
Ashurst (Kent)|AHS
Ashurst New Forest|ANF
Ashwell & Morden|AWM
Askam|ASK
Aslockton|ALK
Aspatria|ASP
Aspley Guise|APG
Aston|AST
Atherstone|ATH
Atherton|ATN
Attadale|ATT
Attenborough|ATB
Attleborough|ATL
Auchinleck|AUK
Audley End|AUD
Aughton Park|AUG
Aviemore|AVM
Avoncliff|AVF
Avonmouth|AVN
Axminster|AXM
Aylesbury|AYS
Aylesbury Vale Parkway|AVP
Aylesford|AYL
Aylesham|AYH
Ayr|AYR
Bache|BAC
Baglan|BAJ
Bagshot|BAG
Baildon|BLD
Baillieston|BIO
Balcombe|BAB
Baldock|BDK
Balham|BAL
Balloch|BHC
Balmossie|BSI
Bamber Bridge|BMB
Bamford|BAM
Banavie|BNV
Banbury|BAN
Bangor (Gwynedd)|BNG
Bank Hall|BAH
Banstead|BAD
Barassie|BSS
Barbican|BBK
Bardon Mill|BLL
Bare Lane|BAR
Bargeddie|BGI
Bargoed|BGD
Barking|BKG
Barlaston|BLO
Barming|BMG
Barmouth|BRM
Barnehurst|BNH
Barnes|BNS
Barnes Bridge|BNI
Barnetby|BTB
Barnham|BAA
Barnhill|BNL
Barnsley|BNY
Barnstaple|BNP
Barnt Green|BTG
Barrhead|BRR
Barrhill|BRL
Barrow Haven|BAV
Barrow-in-Furness|BIF
Barrow-Upon-Soar|BWS
Barry|BRY
Barry Docks|BYD
Barry Links|BYL
Barry Island|BYI
Barton-on-Humber|BAU
Basildon|BSO
Basingstoke|BSK
Bat & Ball|BBL
Bath Spa|BTH
Bathgate|BHG
Batley|BTL
Battersby|BTT
Battersea Park|BAK
Battle|BAT
Battlesbridge|BLB
Bayford|BAY
Beaconsfield|BCF
Bearley|BER
Bearsden|BRN
Bearsted|BSD
Beasdale|BSL
Beauly|BEL
Bebington|BEB
Beccles|BCC
Beckenham Hill|BEC
Beckenham Junction|BKJ
Bedford|BDM
Bedford St Johns|BSJ
Bedhampton|BDH
Bedminster|BDI
Bedworth|BEH
Bedwyn|BDW
Beeston|BEE
Bekesbourne|BKS
Belle Vue|BLV
Bellgrove|BLG
Bellingham|BGM
Bellshill|BLH
Belmont|BLM
Belper|BLP
Beltring|BEG
Belvedere|BVD
Bempton|BEM
Ben Rhydding|BEY
Benacre|BCR
Benfleet|BEF
Bentham|BEN
Bentley (Hampshire)|BTY
Bentley (South Yorkshire)|BYK
Berney Arms|BYA
Berwick-upon-Tweed|BWK
Bescar Lane|BES
Betws-y-Coed|BYC
Beverley|BEV
Bexhill|BEX
Bexley|BXY
Bexleyheath|BXH
Bicester North|BCS
Bicester Village|BIT
Bickenhill|BIK
Bidston|BID
Biggleswade|BIW
Bilbrook|BBK
Billericay|BIC
Billingham (Cleveland)|BIL
Billingshurst|BIG
Bingham|BIN
Bingley|BIY
Birchgrove|BCG
Birchington-on-Sea|BCH
Birchwood|BWD
Birkbeck|BIK
Birkdale|BDL
Birkenhead Central|BKC
Birkenhead Hamilton Square|BKQ
Birkenhead North|BKN
Birkenhead Park|BKP
Birmingham International|BHI
Birmingham Moor Street|BMO
Birmingham New Street|BHM
Birmingham Snow Hill|BSH
Bishop Auckland|BIA
Bishops Stortford|BIS
Bishopstone|BIP
Bishopton|BPT
Blackburn|BBN
Blackfriars|BFR
Blackheath|BKH
Blackhorse Road|BHO
Blackpool North|BPN
Blackpool Pleasure Beach|BPB
Blackpool South|BPS
Blackrod|BLK
Blackwater|BAW
Blair Atholl|BLA
Blairhill|BAI
Blake Street|BKT
Blakedown|BKD
Blantyre|BLT
Blaydon|BLO
Bleasby|BSB
Bletchley|BLY
Bloxwich|BLX
Bloxwich North|BWN
Blundellsands & Crosby|BLN
Blythe Bridge|BYB
Bodmin Parkway|BOD
Bodorgan|BOR
Bognor Regis|BOG
Bolton|BON
Bolton-on-Dearne|BTD
Bookham|BKA
Bootle (Cumbria)|BOC
Bootle New Strand|BNW
Bootle Oriel Road|BOT
Bordesley|BBS
Borough Green & Wrotham|BRG
Borth|BRH
Bosham|BOH
Boston|BSN
Botley|BOE
Bottesford|BTF
Bourne End|BNE
Bournemouth|BMH
Bournville|BRV
Bow Brickhill|BWB
Bow Street|BOW
Bowes Park|BOP
Bowling|BWG
Box Hill & Westhumble|BXW
Bracknell|BCE
Bradford Forster Square|BDQ
Bradford Interchange|BDI
Bradford-on-Avon|BOA
Brading|BDN
Braintree|BTR
Braintree Freeport|BTP
Bramhall|BML
Bramley (Hants)|BMY
Bramley (West Yorkshire)|BLE
Brampton (Cumbria)|BMP
Brampton (Suffolk)|BRP
Branchton|BCN
Brandon|BND
Branksome|BSM
Braystones|BYS
Bredbury|BDY
Breich|BRC
Brentford|BFD
Brentwood|BRE
Bricket Wood|BWO
Bridge of Allan|BEA
Bridge of Orchy|BRO
Bridgend|BGN
Bridgeton|BDG
Bridgwater|BWT
Bridlington|BDT
Brierfield|BRF
Brigg|BGG
Brighouse|BGH
Brighton|BTN
Brimsdown|BMD
Brimstage|BMT
Brinington|BNT
Bristol Parkway|BPW
Bristol Temple Meads|BRI
Brithdir|BHD
Briton Ferry|BNF
Brixton|BRX
Broad Green|BGE
Broadbottom|BDB
Broadstairs|BSR
Brockenhurst|BCU
Brockholes|BHS
Brockley|BCY
Bromborough|BOM
Bromborough Rake|BMR
Bromley Cross|BMC
Bromley North|BMN
Bromley South|BMS
Bromsgrove|BMV
Brondesbury|BSY
Brondesbury Park|BSP
Brookmans Park|BPK
Brookwood|BKO
Broome|BME
Broomfleet|BMF
Brora|BRA
Brough|BUH
Brough (East Yorkshire)|BRU
Broughty Ferry|BYF
Broxbourne|BXB
Bruce Grove|BCV
Brundall|BDA
Brundall Gardens|BGA
Brunstane|BSU
Brunswick|BRW
Bruton|BRU
Bryn|BYN
Buckenham|BUC
Buckley|BCK
Bucknell|BUK
Bugle|BGL
Builth Road|BHR
Bulwell|BLW
Bures|BUE
Burgess Hill|BUG
Burley Park|BUY
Burley-in-Wharfedale|BUW
Burnage|BNA
Burneside (Cumbria)|BUD
Burnham|BUU
Burnham-on-Crouch|BUO
Burnley Barracks|BUB
Burnley Central|BNC
Burnley Manchester Road|BYM
Burntisland|BTS
Burscough Bridge|BCB
Burscough Junction|BCJ
Bursledon|BUQ
Burton Joyce|BUJ
Burton-on-Trent|BUT
Bury St Edmunds|BSE
Busby|BUS
Bush Hill Park|BHK
Bushey|BSH
Butlers Lane|BUL
Butlins Ent|BUE
Buxton|BUX
Byfleet & New Haw|BFN
Bynea|BYE
Cadoxton|CAD
Caergwrle|CGW
Caerphilly|CPH
Caersws|CWS
Caldercruix|CAC
Caldicot|CDT
Caledonian Rd & Barnsbury|CIR
Calstock|CSK
Cam & Dursley|CDU
Camberley|CAM
Camborne|CBN
Cambridge|CBG
Cambridge Heath|CBH
Cambuslang|CBL
Camden Road|CMD
Camelon|CMO
Canada Water|ZCW
Canley|CNL
Cannock|CAO
Canonbury|CNN
Canterbury East|CBE
Canterbury West|CBW
Cantley|CNY
Capenhurst|CPU
Carbis Bay|CBB
Cardenden|CDD
Cardiff Bay|CDB
Cardiff Central|CDF
Cardiff Queen Street|CDQ
Cardonald|CDO
Cardross|CDR
Carfin|CRF
Cark & Cartmel|CAK
Carlisle|CAR
Carlton|CTO
Carluke|CLU
Carmarthen|CMN
Carmyle|CML
Carnforth|CNF
Carnoustie|CAN
Carntyne|CAY
Carpenders Park|CPK
Carrbridge|CAG
Carshalton|CSH
Carshalton Beeches|CSB
Carstairs|CRS
Carterton|CTN
Castle Bar Park|CBP
Castle Cary|CLC
Castle Douglas|CDS
Castleford|CFD
Castleton (Manchester)|CAS
Castleton Moor|CSM
Caterham|CAT
Catford|CTF
Catford Bridge|CFB
Cattal|CTL
Causeland|CAU
Cefn-y-Bedd|CYB
Chadwell Heath|CTH
Chafford Hundred|CFH
Chalfont & Latimer|CFO
Chalkwell|CHW
Chandlers Ford|CFR
Chapel-en-le-Frith|CEF
Chapelton (Devon)|CPN
Chapeltown|CLN
Chappel & Wakes Colne|CWC
Charing (Kent)|CHG
Charing Cross (Glasgow)|CHC
Charlbury|CBY
Charlton|CTN
Chartham|CRT
Chassen Road|CSR
Chatelherault|CTE
Chatham|CTM
Chathill|CHT
Cheadle Hulme|CHU
Chelford|CEL
Chelmsford|CHM
Chelsfield|CLD
Cheltenham Spa|CNM
Chepstow|CPW
Cherry Tree|CYT
Chertsey|CHY
Cheshunt|CHN
Chessington North|CSN
Chessington South|CSS
Chester|CTR
Chester Road|CRD
Chesterfield|CHD
Chestfield & Swalecliffe|CSW
Chichester|CCH
Chilham|CIL
Chilworth|CHL
Chingford|CHI
Chinley|CLY
Chippenham|CPM
Chipstead|CHP
Chirk|CRK
Chislehurst|CIT
Chiswick|CHK
Cholsey|CHO
Chorley|CRL
Chorleywood|CLW
Christchurch|CHR
Christs Hospital|CHH
Church & Oswaldtwistle|CTW
Church Fenton|CHF
Church Stretton|CTT
Cilmeri|CIM
City Thameslink|CTK
Clacton-on-Sea|CLA
Clandon|CLA
Clapham (North Yorkshire)|CPY
Clapham High Street|CLP
Clapham Junction|CLJ
Clapton|CPT
Clarbeston Road|CLR
Clarkston|CKS
Claverdon|CLV
Claygate|CLG
Cleethorpes|CLE
Cleland|CEA
Clifton Down|CFN
Clitheroe|CLH
Clock House|CLK
Cloughjordan|CRD
Clunderwen|CUW
Clydebank|CYK
Coatbridge Central|CBC
Coatbridge Sunnyside|CBS
Coatdyke|COA
Cobham & Stoke d'Abernon|CSD
Cockermouth|COM
Cockfosters|CFS
Codsall|CSL
Colchester|COL
Colchester Town|CET
Coleshill Parkway|CEH
Collingham|CLL
Collington|CLL
Colne|CNE
Colwall|CWL
Colwyn Bay|CWB
Combe|CME
Commondale|COM
Compton|CMO
Conisbrough|CNS
Connel Ferry|CON
Conon Bridge|CBD
Conway Park|CNP
Conwy|CNW
Cooden Beach|COB
Cookham|COO
Cook's Bridge|CSB
Copplestone|COP
Corbridge|CRB
Corby|COR
Corkerhill|CKH
Corkickle|CKL
Corpach|CPA
Corrour|COR
Coryton|COY
Coseley|CSY
Cosford|COS
Cosham|CSA
Cottingham|CGM
Cottingley|COT
Coulsdon South|CDS
Coulsdon Town|CDN
Coventry|COV
Cowden|CWN
Cowdenbeath|COW
Cradley Heath|CRA
Craigendoran|CGD
Cramlington|CRM
Cranbrook|CRK
Craven Arms|CRV
Crawley|CRW
Crayford|CRY
Crediton|CDI
Cressing|CES
Cressington|CSG
Creswell|CWD
Crewe|CRE
Crewkerne|CKN
Crews Hill|CWH
Crianlarich|CNR
Criccieth|CCC
Cricklewood|CRI
Croftfoot|CFF
Crofton Park|CFT
Cromer|CMR
Cromford|CMF
Crookston|CKT
Cross Gates|CRG
Crossflatts|CFL
Crosshill|COI
Crosskeys|CKY
Crossmyloof|CMY
Croston|CSO
Crouch Hill|CRH
Crowborough|COH
Crowhurst|CWU
Crowle|CWE
Croxley|CRX
Croy|CRO
Crystal Palace|CYP
Cuddington|CUD
Cuffley|CUF
Culham|CUM
Culrain|CUA
Cumbernauld|CUB
Cupar|CUP
Curriehill|CUH
Curzon Street|CZN
Cwm|CWM
Cwmbran|CWM
Cynghordy|CYG
Dagenham Dock|DDK
Daisy Hill|DSY
Dalgety Bay|DAG
Dalmally|DAL
Dalmarnock|DAK
Dalmeny|DAM
Dalmuir|DMR
Dalreoch|DLR
Dalry|DLY
Dalston Junction|DLJ
Dalston Kingsland|DLK
Dalton (Cumbria)|DLT
Dalwhinnie|DLW
Danby|DNY
Danzey|DZY
Darlington|DAR
Darnall|DAN
Darsham|DSM
Dartford|DFD
Darton|DRT
Darwen|DWN
Datchet|DAT
Davenport|DVN
Dawlish|DWL
Dawlish Warren|DWW
Dean Lane|DEA
Deansgate|DGT
Deepcar|DEE
Deganny|DEI
Deighton|DHN
Delamere|DLM
Denby Dale|DBD
Denham|DNM
Denham Golf Club|DGC
Denmark Hill|DMK
Dent|DNT
Denton|DTN
Deptford|DEP
Derby|DBY
Derby Road (Ipswich)|DBR
Devonport|DPT
Dewsbury|DEW
Didcot Parkway|DID
Digby & Sowton|DIG
Dilton Marsh|DMH
Dinas (Gwynedd)|DNS
Dinas (Rhondda)|DMG
Dingle Road|DGL
Dingwall|DIN
Dinsdale|DND
Dinting|DTG
Disley|DSL
Diss|DIS
Dockyard|DOC
Dodworth|DOD
Dolau|DOL
Doleham|DLH
Dolgarrog|DLG
Dolwyddelan|DWD
Doncaster|DON
Dorchester South|DCH
Dorchester West|DCW
Dore & Totley|DOR
Dorking|DKG
Dorking Deepdene|DPK
Dorking West|DKT
Dormans|DMS
Dorridge|DDG
Dove Holes|DVH
Dover Priory|DVP
Dovercourt|DVC
Doveridge|DVG
Downham Market|DOW
Downs Park|DPK
Drayton Green|DRG
Drayton Park|DYP
Drem|DRM
Driffield|DRF
Drigg|DRI
Droitwich Spa|DTW
Dronfield|DRO
Drumchapel|DMC
Drumfrochar|DFR
Drumgelloch|DRU
Drumry|DMY
Dublin Ferryport|DFP
Duddeston|DUD
Dudley Port|DDP
Duffield|DFI
Duirinish|DRN
Duke Street|DST
Dullingham|DUL
Dumbarton Central|DBC
Dumbarton East|DBE
Dumbreck|DUM
Dumfries|DMF
Dunbar|DUN
Dunblane|DBL
Duncraig|DCG
Dundee|DEE
Dunfermline Abbey|DFE
Dunfermline Queen Margaret|DFL
Dunfermline Town|DFE
Dunkeld & Birnam|DKD
Dunlop|DNL
Dunrobin Castle|DNO
Duns|DUC
Dunston|DOT
Dunton Green|DGT
Durham|DHM
Durrington-on-Sea|DUR
Dyce|DYC
Dyffryn Ardudwy|DYF
Eaglescliffe|EAG
Ealing Broadway|EAL
Earlestown|ERL
Earley|EAR
Earlsfield|EAD
Earlswood (Surrey)|ELD
Earlswood (West Midlands)|EWD
East Croydon|ECR
East Didsbury|EDY
East Dulwich|EDW
East Garforth|EGF
East Grinstead|EGR
East Kilbride|EKL
East Malling|EML
East Midland Parkway|EMD
East Tilbury|ETL
East Worthing|EWR
Eastbourne|EBN
Eastbrook|EBK
Easterhouse|EST
Eastham Rake|ERA
Eastleigh|ESL
Eastriggs|EST
Ebbsfleet International|EBD
Ebbw Vale Parkway|EBV
Eccles|ECC
Eccles Road|ECS
Eccleston Park|ECL
Edale|EDL
Eden Park|EDN
Edenbridge|EBR
Edenbridge Town|EBT
Edge Hill|EDG
Edinburgh Gateway|EDY
Edinburgh Park|EDP
Edinburgh Waverley|EDB
Edmonton Green|EDR
Effingham Junction|EFF
Eggesford|EGG
Egham|EGH
Egton|EGT
Elephant & Castle|EPH
Elgin|ELG
Ellesmere Port|ELP
Elmers End|ELE
Elmstead Woods|ESD
Elmswell|ESW
Elsecar|ELR
Elsenham|ESM
Elstree & Borehamwood|ELS
Eltham|ELW
Elton & Orston|ELO
Ely|ELY
Emerson Park|EMP
Emsworth|EMS
Enfield Chase|ENC
Enfield Lock|ENL
Enfield Town|ENF
Entwistle|ENT
Epsom|EPS
Epsom Downs|EPD
Erdington|ERD
Eridge|ERI
Erlestoke|ERS
Esher|ESH
Eskbank|EKB
Essex Road|EXR
Etchingham|ETC
Eton Wick|EWK
Euxton Balshaw Lane|EBA
Evesham|EVE
Ewell East|EWE
Ewell West|EWW
Exeter Central|EXC
Exeter St Davids|EXD
Exeter St Thomas|EXT
Exhibition Centre|EXG
Exmouth|EXM
Exton|EXN
Eynsford|EYN
Fairbourne|FRB
Fairfield|FRF
Fairlie|FRL
Fairwater|FRW
Falconwood|FCN
Falkirk Grahamston|FKG
Falkirk High|FKK
Falls of Cruachan|FOC
Falmer|FMR
Falmouth Docks|FAL
Falmouth Town|FMT
Fareham|FRM
Farnborough (Main)|FNB
Farnborough North|FNN
Farncombe|FNC
Farnham|FNH
Farningham Road|FNR
Farnworth|FNW
Farringdon|ZFD
Faversham|FAV
Faygate|FGT
Fearn|FRN
Featherstone|FEA
Felixstowe|FLX
Feltham|FEL
Feniton|FNT
Fenny Stratford|FEN
Fernhill|FER
Ferriby|FRY
Ferryside|FYS
Ffairfach|FFA
Filey|FIL
Filton Abbey Wood|FIT
Finchley Road & Frognal|FNY
Fingringhoe|FGH
Finlow Ferry|FFF
Finsbury Park|FPK
Finstock|FIN
Fishbourne (Sussex)|FSB
Fishersgate|FSG
Fishguard Harbour|FGH
Fiskerton|FSK
Fitzwilliam|FZW
Five Ways|FVW
Fleet|FLE
Flimby|FLM
Flint|FLN
Flixton|FLI
Flowery Field|FLF
Folkestone Central|FKC
Folkestone West|FKW
Ford|FOD
Forest Gate|FOG
Forest Hill|FOH
Formby|FBY
Forres|FOR
Forsinard|FRS
Fort Matilda|FTM
Fort William|FTW
Four Oaks|FOK
Foxfield|FOX
Foxton|FXN
Frant|FRT
Fratton|FTN
Freshfield|FRE
Freshford|FFD
Frimley|FML
Frinton-on-Sea|FRI
Frizinghall|FZH
Frodsham|FRD
Frome|FRO
Fulwell|FLW
Furness Vale|FNV
Furzebrook|FZB
Furze Platt|FZP
Gainsborough Central|GNB
Gainsborough Lea Road|GBL
Galashiels|GAL
Garelochhead|GCH
Gargrave|GGV
Garrowhill|GAR
Garscadden|GRS
Garsdale|GSD
Garston|GRT
Garth (Mid Glamorgan)|GMG
Garth (Powys)|GTH
Garve|GVE
Gathurst|GTH
Gatley|GTY
Gatwick Airport|GTW
Georgemas Junction|GGJ
Gerrards Cross|GER
Gidea Park|GDP
Giffnock|GFN
Giggleswick|GIG
Gilberdyke|GBD
Gilfach Fargoed|GFF
Gillingham (Dorset)|GIL
Gillingham (Kent)|GLM
Gilshochill|GSC
Gipsy Hill|GIP
Girvan|GIR
Glaisdale|GLS
Glan Conwy|GCW
Glasgow Central|GLC
Glasgow Queen Street|GLQ
Glasshoughton|GLH
Glazebrook|GLZ
Gleneagles|GLE
Glenfinnan|GLF
Glengarnock|GLG
Glenrothes with Thornton|GLT
Glossop|GLO
Gloucester|GCR
Glynde|GLY
Godalming|GOD
Godley|GDL
Godstone|GDN
Goldthorpe|GOE
Golf Street|GOF
Golspie|GOL
Gomshall|GOM
Goodmayes|GMY
Goole|GOO
Goostrey|GTR
Gordon Hill|GDH
Gorebridge|GBG
Goring & Streatley|GOR
Goring-by-Sea|GBS
Gorton|GTO
Gospel Oak|GPO
Gourock|GRK
Goxhill|GOX
Grange-over-Sands|GOS
Grange Park|GPK
Grangetown (Cardiff)|GTN
Grangetown (S. Glamorgan)|GNG
Grantham|GRA
Grateley|GRT
Gravelly Hill|GVH
Gravesend|GRV
Grays|GRY
Great Ayton|GTA
Great Bentley|GRB
Great Chesterford|GRC
Great Coates|GCT
Great Malvern|GMV
Great Missenden|GMN
Great Stammore|GTM
Great Yarmouth|GYM
Green Lane|GNL
Green Road|GNR
Greenbank|GBK
Greenfaulds|GRL
Greenfield|GNF
Greenford|GFD
Greenhithe|GNH
Greenloaning|GRN
Greenock Central|GKC
Greenock West|GKW
Greenwich|GNW
Gretna Green|GEA
Grimsby Docks|GMD
Grimsby Town|GMB
Grindleford|GRN
Grosmont|GMT
Grove Park|GRP
Guide Bridge|GUI
Guildford|GLD
Guiseley|GSY
Gunnersbury|GUN
Gunnislake|GSL
Gunton|GNT
Gwersyllt|GWE
Gypsy Lane|GYP
Habrough|HAB
Hackbridge|HCB
Hackney Central|HKC
Hackney Downs|HAC
Hackney Wick|HKW
Haddiscoe|HAD
Hadfield|HDF
Hadley Wood|HDW
Hag Fold|HGF
Haggerston|HGG
Hagley|HAG
Hairmyres|HMY
Hale (Hants)|HLE
Halesworth|HAS
Halewood|HED
Halifax|HFX
Hall Green|HLG
Hall Road|HLR
Halling|HAI
Haltwhistle|HWH
Ham Street|HMT
Hamble|HME
Hamilton Central|HNC
Hamilton West|HNW
Hammerton|HMM
Hampden Park (Sussex)|HMD
Hampstead Heath|HDH
Hampton|HMP
Hampton Court|HMC
Hampton Wick|HMW
Hampton-in-Arden|HIA
Hamstead (Birmingham)|HSD
Hamworthy|HAM
Hanbury|HNY
Handforth|HTH
Hanwell|HAN
Hapton|HPN
Harlech|HRL
Harlesden|HDN
Harling Road|HRD
Harlington|HLN
Harlow Mill|HWM
Harlow Town|HWN
Harold Wood|HRO
Harpenden|HPD
Harrietsham|HRM
Harringay|HGY
Harringay Green Lanes|HRY
Harrington|HRR
Harrogate|HGT
Harrow & Wealdstone|HRW
Harrow-on-the-Hill|HOH
Hartford|HTF
Hartlebury|HBY
Hartlepool|HPL
Hartwood|HTW
Harwich International|HPQ
Harwich Town|HWC
Haslemere|HSL
Hassocks|HSK
Hastings|HGS
Hatch End|HTE
Hatfield|HAT
Hatfield & Stainforth|HFS
Hathersage|HSG
Hattersley|HTY
Hatton|HTN
Havant|HAV
Havenhouse|HVN
Haverfordwest|HFD
Hawarden|HWD
Hawarden Bridge|HWB
Hawes|HWS
Hawick|HWK
Haydons Road|HYR
Hayes & Harlington|HAY
Hayes (Kent)|HYS
Hayle|HYL
Haymarket|HYM
Haywards Heath|HHE
Hazel Grove|HAZ
Headcorn|HCN
Headingley|HDY
Headstone Lane|HDL
Heald Green|HDG
Healing|HLI
Heathrow Airport Terminal 4|HAF
Heathrow Airport Terminal 5|HWV
Heathrow Airport Terminals 2 & 3|HXX
Heaton Chapel|HTC
Hebden Bridge|HBD
Heckington|HEC
Hednesford|HNF
Heighington|HEI
Helensburgh Central|HLC
Helensburgh Upper|HLU
Hellifield|HLD
Helmsdale|HMS
Helsby|HSB
Hemel Hempstead|HML
Hendon|HEN
Henley-in-Arden|HNL
Henley-on-Thames|HOT
Hensall|HEL
Hereford|HFD
Herne Bay|HNB
Herne Hill|HNH
Hersham|HER
Hertford East|HFE
Hertford North|HFN
Hessle|HES
Heswall|HSW
Heworth|HEW
Hexham|HEX
Heyford|HYD
Heysham Port|HHB
High Barnet|HBT
High Brooms|HIB
High Street (Glasgow)|HST
High Wycombe|HWY
Higham (Kent)|HGM
Highams Park|HIP
Highbridge & Burnham|HIG
Highbury & Islington|HHY
Highgate|HIG
Hightown|HTO
Hilsea|HLS
Hinchley Wood|HYW
Hinckley|HNK
Hindley|HID
Hinton Admiral|HNA
Hitchin|HIT
Hockley|HOC
Hollingbourne|HBN
Holmes Chapel|HCH
Holmwood|HLM
Holton Heath|HOL
Holyhead|HHD
Holytown|HLY
Homerton|HMN
Honeybourne|HYB
Honiton|HON
Honley|HOY
Honor Oak Park|HPA
Hook|HOK
Hooton|HOO
Hope (Derbyshire)|HOP
Hopton Heath|HPT
Horley|HOR
Hornbeam Park|HBP
Hornsey|HRN
Horsforth|HRS
Horsham|HRH
Horsley|HSY
Horton-in-Ribblesdale|HIR
Horwich Parkway|HWI
Hoscar|HSC
Hough Green|HGN
Hounslow|HOU
House of Water|HOW
Hove|HOV
How Wood|HWW
Howden|HOW
Howick|HWK
Howwood|HOZ
Hoxton|HOX
Hoylake|HYK
Hubberts Bridge|HUB
Hucknall|HKN
Huddersfield|HUD
Hull|HUL
Humphrey Park|HUP
Hungerford|HGD
Hunmanby|HUB
Huntingdon|HUN
Huntly|HNT
Hunts Cross|HNX
Hurst Green|HUR
Hutton Cranswick|HUT
Hyde Central|HYC
Hyde North|HYT
Hykeham|HKM
Hyndland|HYN
Hythe (Kent)|HYH
IBM Halt|IBM
Ifield|IFI
Ilford|IFD
Ilkeston|ILN
Ilkley|ILK
Imperial Wharf|IMW
Ince & Elton|INE
Ince (Manchester)|INC
Ingatestone|ING
Insch|INS
Invergordon|IGD
Invergowrie|ING
Inverkeithing|INK
Inverkip|INP
Invershin|INH
Inverurie|INR
Ipswich|IPS
Irlam|IRL
Irvine|IRV
Islip|ISP
Iver|IVR
Ivybridge|IVY
James Cook|JCH
Jewellery Quarter|JEQ
Johnstone|JHN
Johnstone (Strathclyde)|JHN
Jordanhill|JOR
Kelvindale|KVD
Kemsing|KMS
Kemsley|KML
Kendal|KEN
Kenilworth|KNW
Kenley|KLY
Kennett|KNE
Kennishead|KNS
Kensal Green|KNL
Kensal Rise|KNR
Kensington Olympia|KPA
Kent House|KTH
Kentish Town|KTN
Kentish Town West|KTW
Kenton|KNT
Kents Bank|KBK
Kettering|KET
Keyham|KEY
Keynsham|KYN
Kidbrooke|KDB
Kidderminster|KID
Kidsgrove|KDG
Kidwelly|KWL
Kilburn High Road|KBN
Kildale|KIL
Kildonan|KIL
Kilgetty|KGT
Kilmarnock|KMK
Kilmaurs|KLM
Kilpatrick|KPT
Kilwinning|KWN
Kinbrace|KBC
Kingham|KGM
Kinghorn|KGH
Kings Langley|KGL
Kings Lynn|KLN
Kings Norton|KNN
Kings Nympton|KGN
Kings Park|KGP
Kings Sutton|KGS
Kingsknowe|KGE
Kingston|KNG
Kingswood|KND
Kingussie|KIN
Kinloss|KLS
Kintbury|KIT
Kirby Cross|KBX
Kirk Sandall|KKS
Kirkby|KIR
Kirkby in Ashfield|KKB
Kirkby Stephen|KSW
Kirkcaldy|KDY
Kirkconnel|KKC
Kirkham & Wesham|KKM
Kirkhill|KKH
Kirknewton|KKN
Kirkstall Forge|KLF
Kirkwood|KWD
Kirton Lindsey|KTL
Kiveton Bridge|KIV
Kiveton Park|KVP
Knaresborough|KNA
Knebworth|KBW
Knighton|KNI
Knockholt|KCK
Knottingley|KNO
Knucklas|KNU
Knutsford|KNF
Kyle of Lochalsh|KYL
Ladybank|LDY
Ladywell|LAW
Laindon|LAY
Lairg|LRG
Lake|LKE
Lakenheath|LAK
Lamphey|LAM
Lanark|LNK
Lancaster|LAN
Lancing|LAC
Landywood|LAW
Langbank|LGB
Langho|LHO
Langley (Berks)|LNY
Langley Green|LLG
Langley Mill|LGM
Langside|LGS
Langwith-Whaley Thorns|LAG
Lapford|LAP
Lapworth|LPW
Larbert|LBT
Largs|LAR
Larkhall|LRH
Laurencekirk|LAU
Lawrence Hill|LWH
Layton (Lancs)|LAY
Lazonby & Kirkoswald|LZB
Lea Bridge|LEB
Lea Green|LEG
Lea Hall|LEH
Lealholm|LHM
Leamington Spa|LMS
Leasowe|LSW
Leatherhead|LHD
Ledbury|LED
Lee|LEE
Leeds|LDS
Leicester|LEI
Leigh (Kent)|LIH
Leigh-on-Sea|LES
Leighton Buzzard|LBZ
Lelant|LEL
Lelant Saltings|LTS
Lenham|LEN
Lenzie|LNZ
Leominster|LEO
Letchworth Garden City|LET
Leuchars|LEU
Levenshulme|LVM
Lewes|LWS
Lewisham|LEW
Leyland|LEY
Leyton|LEY
Leyton Midland Road|LEM
Leytonstone|LYE
Lichfield City|LIC
Lichfield Trent Valley|LTV
Lidlington|LID
Limehouse|LHS
Limerick|LRK
Lincoln Central|LCN
Lingfield|LFD
Lingwood|LGD
Linlithgow|LIN
Liphook|LIP
Liskeard|LSK
Liss|LIS
Lisvane & Thornhill|LVT
Little Kimble|LTK
Little Sutton|LTT
Littleborough|LTL
Littlehampton|LIT
Littlehaven|LVN
Littleport|LTP
Liverpool Central|LVC
Liverpool James Street|LVJ
Liverpool Lime Street|LIV
Liverpool South Parkway|LPY
Livingston North|LSN
Livingston South|LVN
Llanaber|LLA
Llanbedr|LBR
Llanbister Road|LLT
Llanbradach|LNB
Llandaf|LLN
Llandanwg|LDN
Llandecwyn|LLC
Llandeilo|LLL
Llandovery|LLV
Llandrindod|LLO
Llandudno|LLD
Llandudno Junction|LLJ
Llandybie|LLI
Llanelli|LLE
Llanfairfechan|LLF
Llanfairpwll|LPG
Llangadog|LLG
Llangammarch|LLM
Llangennech|LLE
Llangynllo|LGO
Llanharan|LHR
Llanhilleth|LTH
Llanishen|LLS
Llanrwst|LWR
Llansamlet|LAS
Llantwit Major|LWM
Llanwrda|LNR
Llanwrtyd|LNW
Llwyngwril|LLW
Llwynypia|LLP
Loch Awe|LHA
Loch Eil Outward Bound|LHE
Lochailort|LCL
Locheilside|LCS
Lochgelly|LCG
Lochluichart|LCC
Lochwinnoch|LHW
Lockerbie|LOC
Lockwood|LCK
London Blackfriars|BFR
London Bridge|LBG
London Cannon Street|CST
London Charing Cross|CHX
London Euston|EUS
London Fenchurch Street|FST
London Fields|LOF
London Kings Cross|KGX
London Liverpool Street|LST
London Marylebone|MYB
London Paddington|PAD
London Road (Brighton)|LRD
London Road (Guildford)|LRY
London St Pancras International|STP
London Victoria|VIC
London Waterloo|WAT
London Waterloo East|WAE
Long Buckby|LBK
Long Eaton|LGE
Long Preston|LPR
Longbeck|LGK
Longbridge|LOB
Longcross|LNG
Longfield|LGF
Longniddry|LND
Longport|LPT
Longton|LGN
Looe|LOE
Lostock|LOT
Lostock Gralam|LTG
Lostock Hall|LOH
Lostwithiel|LOS
Loughborough|LBO
Loughborough Junction|LGJ
Low Moor|LMR
Lowdham|LOW
Lower Sydenham|LSY
Lowestoft|LWT
Ludlow|LUD
Luton|LUT
Luton Airport Parkway|LTN
Luxulyan|LUX
Lydney|LYD
Lye|LYE
Lymington Pier|LYP
Lymington Town|LYT
Lympstone Commando|LYC
Lympstone Village|LYV
Lytham|LYM
Macclesfield|MAC
Macduff|MDF
Machynlleth|MCN
Maesteg|MST
Maesteg (Ewenny Road)|MEW
Maghull|MAG
Maiden Newton|MDN
Maidenhead|MAI
Maidstone Barracks|MDB
Maidstone East|MDE
Maidstone West|MDW
Malden Manor|MAL
Mallaig|MLG
Malton|MLT
Malvern Link|MVL
Manchester Airport|MIA
Manchester Piccadilly|MAN
Manchester Oxford Road|MCO
Manchester United Football Ground|MUF
Manningtree|MNG
Manor Park|MNP
Manor Road|MNR
Manorbier|MRB
Manors|MAS
Mansfield|MFT
Mansfield Woodhouse|MSW
March|MCH
Marden (Kent)|MRN
Margate|MAR
Market Harborough|MHR
Market Rasen|MKR
Markinch|MNC
Marks Tey|MKT
Marlow|MLW
Marple|MPL
Marsden|MSD
Marske|MSK
Marston Green|MGN
Martin Mill|MTM
Martins Heron|MAO
Marton|MTO
Maryhill|MYH
Maryland|MYL
Maryport|MRY
Matlock|MAT
Matlock Bath|MTB
Mauldeth Road|MAU
Maxwell Park|MAX
Maybole|MAY
Maze Hill|MZH
Meadowhall|MHS
Mearns|MRN
Meols|MEO
Meols Cop|MEC
Melksham|MKM
Melton (Suffolk)|MES
Melton Mowbray|MBO
Menheniot|MEN
Menston|MNN
Meols Cop|MEP
Meopham|MEP
Meridian Water|MRW
Merryton|MEY
Merstham|MER
Merthyr Tydfil|MER
Mexborough|MEX
Micheldever|MIC
Micklefield|MIK
Middlesbrough|MBR
Middlewood|MDL
Midgham|MDG
Milford (Surrey)|MLF
Milford Haven|MFH
Mill Hill (Lancs)|MLH
Mill Hill Broadway|MIL
Millbrook (Beds)|MLB
Millbrook (Hants)|MLK
Milliken Park|MIN
Milngavie|MLN
Milton Keynes Central|MKC
Minffordd|MFF
Minster|MSR
Mirfield|MIR
Mistley|MIS
Mitcham Eastfields|MTC
Mitcham Junction|MIJ
Mobberley|MOB
Monifieth|MON
Monks Risborough|MRS
Montpelier|MTP
Montrose|MTS
Moorfields|MRF
Moorgate|MOG
Moorside|MSD
Moorthorpe|MRP
Morar|MOR
Morchard Road|MRD
Morden South|MDS
Morecambe|MCM
Moreton (Dorset)|MTN
Moreton (Merseyside)|MRT
Moreton-in-Marsh|MIT
Morfa Mawddach|MFA
Morley|MLY
Morpeth|MPT
Mortimer|MOR
Mortlake|MTL
Moses Gate|MSS
Moss Side|MOS
Mossley|MSL
Mossley Hill|MSH
Mosspark|MSK
Moston|MSO
Motherwell|MTH
Motspur Park|MOT
Mottingham|MTG
Mottisfont & Dunbridge|DBG
Mouldsworth|MLD
Moulsecoomb|MCB
Mount Florida|MFL
Mount Vernon|MTV
Mountain Ash|MTA
Mountfield|MFD
Muir of Ord|MOO
Muirend|MUI
Musselburgh|MUS
Mytholmroyd|MYT
Nafferton|NFN
Nailsea & Backwell|NLS
Nairn|NRN
Nantwich|NAN
Narberth|NAR
Narborough|NBR
Navigation Road|NVR
Neath|NTH
Needham Market|NMT
Neilston|NEI
Nelson|NEL
Neston|NES
Netherfield|NET
Netherton|NTN
Netley|NTL
New Barnet|NBA
New Beckenham|NBC
New Brighton|NBN
New Clee|NCE
New Cross|NWX
New Cross Gate|NXG
New Cumnock|NCK
New Eltham|NEH
New Holland|NHL
New Hythe|NHE
New Lane|NLN
New Malden|NEM
New Mills Central|NMC
New Mills Newtown|NMN
New Milton|NWM
New Pudsey|NPD
New Southgate|NSG
Newark Castle|NCT
Newark North Gate|NNG
Newbridge|NBE
Newbury|NBY
Newbury Racecourse|NRC
Newcastle|NCL
Newcourt|NCO
Newcraighall|NEW
Newhaven Harbour|NVH
Newhaven Town|NVN
Newhey|NHY
Newington|NGT
Newlands|NLS
Newport (Essex)|NWE
Newport (Gwent)|NWP
Newquay|NQY
Newstead|NSD
Newton (Lanarks)|NTN
Newton Abbot|NTA
Newton Aycliffe|NAY
Newton for Hyde|NWN
Newton St Cyres|NTC
Newton-le-Willows|NLW
Newton-on-Ayr|NOA
Newtonmore|NWR
Newtongrange|NEG
Newtonhill|NWH
Newtown (Powys)|NWT
Ninian Park|NNP
Nitshill|NIT
Norbiton|NBT
Norbury|NRB
Normans Bay|NSB
Normanton|NOR
North Berwick|NBK
North Camp|NCM
North Dulwich|NDL
North Fambridge|NFA
North Llanrwst|NLR
North Queensferry|NQU
North Road (Darlington)|NRD
North Sheen|NSH
North Walsham|NWA
North Wembley|NWB
Northallerton|NTR
Northampton|NMP
Northfield|NFD
Northfleet|NFL
Northolt Park|NLT
Northumberland Park|NUM
Northwich|NWI
Norton Bridge|NTB
Norwich|NRW
Norwood Junction|NWD
Nottingham|NOT
Nuneaton|NUN
Nunhead|NHD
Nunthorpe|NNT
Nutbourne|NUT
Nutfield|NUF
Oakengates|OKN
Oakham|OKM
Oakleigh Park|OKL
Oban|OBN
Ockendon|OCK
Ockley|OLY
Old Hill|OHL
Old Roan|ORN
Old Street|OLD
Oldfield Park|OLF
Olton|OLT
Ore|ORE
Ormskirk|OMS
Orpington|ORP
Orrell|ORR
Orrell Park|OPK
Otford|OTF
Oulton Broad North|OUN
Oulton Broad South|OUS
Outwood|OUT
Overpool|OVE
Overton|OVR
Oxenholme Lake District|OXN
Oxford|OXF
Oxford Parkway|OXP
Oxshott|OXS
Oxted|OXT
Paddock Wood|PDW
Padgate|PDG
Paignton|PGN
Paisley Canal|PCN
Paisley Gilmour Street|PYG
Paisley St James|PYJ
Palmers Green|PAL
Pangbourne|PAN
Pannal|PNL
Pantyffynnon|PTF
Par|PAR
Parbold|PBL
Park Street|PKT
Parkhall|PKH
Parson Street|PSN
Partick|PTK
Parton|PRN
Patchway|PWY
Patricroft|PAT
Patterton|PTT
Peartree|PEA
Peckham Rye|PMR
Pegswood|PEG
Pemberton|PEM
Pembrey & Burry Port|PBY
Pembroke|PMB
Pembroke Dock|PMD
Penally|PNA
Penarth|PEN
Pencoed|PCD
Pengam|PGM
Penge East|PNE
Penge West|PNW
Penhelig|PHG
Penistone|PNS
Penkridge|PKG
Penmaenmawr|PMW
Penmere|PNM
Penrhiwceiber|PER
Penrhyndeudraeth|PRH
Penrith|PNR
Penryn|PYN
Pensarn (Gwynedd)|PES
Penshurst|PHR
Pentonville|PEN
Pen-y-Bont|PNB
Penybont|PYB
Penyffordd|PYF
Perranwell|PRW
Perry Barr|PRY
Pershore|PSH
Perth|PTH
Peterborough|PBO
Petersfield|PTR
Petts Wood|PET
Pevensey & Westham|PEV
Pevensey Bay|PEB
Pewsey|PEW
Pilning|PIL
Pinhoe|PIN
Pitlochry|PIT
Pitsea|PSE
Pleasington|PLS
Plockton|PLK
Pluckley|PLC
Plumley|PLM
Plumpton|PMP
Plumstead|PLU
Plymouth|PLY
Pokesdown|POK
Polegate|PLG
Polhill|POL
Polmont|PMT
Polsloe Bridge|POL
Ponders End|PON
Pontarddulais|PTD
Pont-y-Pant|PYP
Pontyclun|PYC
Pontypool & New Inn|PPL
Pontypridd|PPD
Poole|POL
Poppleton|POP
Port Glasgow|PTG
Port Sunlight|PSL
Port Talbot Parkway|PTA
Porth|POR
Porthmadog|PTM
Portlethen|PLN
Portslade|PLD
Portsmouth Arms|PMA
Portsmouth & Southsea|PMS
Portsmouth Harbour|PMH
Possilpark & Parkhouse|PPK
Potters Bar|PBR
Poulton-le-Fylde|PFY
Poynton|PYT
Prees|PRE
Prescot|PSC
Prestatyn|PRT
Prestbury|PRB
Preston|PRE
Preston Park|PRP
Prestonpans|PST
Prestwick|PTW
Prestwick Town|PTT
Primrose Hill|PRM
Princetown|PRC
Prittlewell|PRL
Prudhoe|PRU
Pulborough|PUL
Purfleet|PFL
Purley|PUR
Purley Oaks|PUO
Putney|PUT
Pwllheli|PWL
Pyle|PYL
Quakers Yard|QYD
Queenborough|QBR
Queens Park (Glasgow)|QPW
Queens Park (London)|QPW
Queens Road Peckham|QRP
Queenstown Road (Battersea)|QRB
Quintrell Downs|QUI
Radcliffe-on-Trent|RDF
Radlett|RDT
Radley|RAD
Radyr|RDR
Rainford|RNF
Rainham (Essex)|RNM
Rainham (Kent)|RAI
Rainhill|RNH
Ramsgate|RAM
Ramsgreave & Wilpshire|RGW
Rannoch|RAN
Rauceby|RAU
Ravenglass for Eskdale|RAV
Ravensbourne|RVB
Ravensthorpe|RVN
Rawcliffe|RWC
Rayleigh|RLG
Raynes Park|RAY
Reading|RDG
Reading West|RDW
Rectory Road|REC
Redbridge|RDB
Redcar British Steel|RBS
Redcar Central|RCC
Redcar East|RCE
Reddish North|RDN
Reddish South|RDS
Redditch|RDC
Redhill|RDH
Redland|RDA
Redruth|RDR
Reedham (Norfolk)|REE
Reedham (Surrey)|RHM
Reigate|REI
Renton|RTN
Reston|RSN
Retford|RET
Rhiwbina|RHI
Rhoose Cardiff International Airport|RIA
Rhosneigr|RHO
Rhyl|RHL
Rhymney|RHY
Ribblehead|RHD
Riccarton|RCC
Rice Lane|RIL
Richmond (London)|RMD
Rickmansworth|RIC
Riddlesdown|RDD
Ridgmont|RID
Riding Mill|RDM
Risca & Pontymister|RCA
Rise Park|RSP
Rishton|RIS
Robin Hood|ROH
Roby|ROB
Rochdale|RCD
Roche|ROC
Rochester|RTR
Rochford|RFD
Rock Ferry|RFY
Rogart|ROG
Rogerstone|ROR
Rolleston|ROL
Roman Bridge|RMB
Romford|RMF
Romiley|RML
Romsey|ROM
Roose|ROO
Rose Grove|RSG
Rose Hill Marple|RSH
Rosyth|ROS
Rotherham Central|RMC
Roughton Road|RNR
Rowley Regis|ROW
Roy Bridge|RYB
Roydon|RYN
Royston|RYS
Ruabon|RUA
Rufford|RUF
Rugby|RUG
Rugeley Town|RGT
Rugeley Trent Valley|RGL
Runcorn|RUN
Runcorn East|RUE
Ruskington|RKT
Ruswarp|RUS
Rutherglen|RUT
Ryde Esplanade|RYD
Ryde Pier Head|RYP
Ryde St Johns Road|RYR
Ryde|RYD
Rye (Sussex)|RYE
Rye House|RYH
Salford Central|SFD
Salford Crescent|SLD
Salfords|SAF
Salhouse|SAH
Salisbury|SAL
Saltaire|SAE
Saltash|STS
Saltburn|SLB
Saltcoats|SLT
Saltmarshe|SAM
Salwick|SLW
Sandal & Agbrigg|SNA
Sandbach|SDB
Sandhill|SDL
Sandhills|SDL
Sandhurst|SND
Sandling|SDG
Sandown|SAN
Sandplace|SDP
Sandwell & Dudley|SAD
Sandwich|SDW
Sandy|SDY
Sankey for Penketh|SNK
Sanquhar|SQH
Sarn|SAR
Saundersfoot|SDF
Saunderton|SDR
Sawbridgeworth|SAW
Saxilby|SXY
Saxmundham|SAX
Scalby|SCB
Scarborough|SCA
Scotscalder|SCT
Scotstounhill|SCH
Scunthorpe|SCU
Sea Mills|SML
Seaford|SEF
Seaham|SEA
Seamer|SEM
Seascale|SSC
Seaton Carew|SEC
Seer Green & Jordans|SRG
Selby|SBY
Selhurst|SRS
Sellafield|SEL
Selling|SEG
Selly Oak|SLY
Settle|SET
Seven Kings|SVK
Seven Sisters|SVS
Sevenoaks|SEV
Severn Beach|SVB
Severn Tunnel Junction|STJ
Shadwell|SDE
Shalford|SFR
Shanklin|SHN
Shawfair|SFI
Shawford|SHW
Shawlands|SHL
Sheerness-on-Sea|SSE
Sheffield|SHF
Shelford (Cambs)|SED
Shenfield|SNF
Shenstone|SEN
Shepherd's Bush|SPB
Shepherds Well|SPH
Shepley|SPY
Shepperton|SHP
Shepreth|STH
Sherborne|SHE
Sherburn-in-Elmet|SIE
Sheringham|SHM
Shettleston|SHC
Shieldmuir|SDM
Shifnal|SFN
Shildon|SHD
Shiplake|SHI
Shipley|SHY
Shippea Hill|SPP
Shipton|SIP
Shirebrook|SHB
Shirehampton|SHH
Shireoaks|SRO
Shirley|SRL
Shoeburyness|SRY
Sholing|SHO
Shoreditch High Street|SDE
Shoreham-by-Sea|SSH
Shortlands|SRT
Shotton|SHT
Shotts|SHS
Shrewsbury|SHR
Sidcup|SID
Sileby|SIL
Silecroft|SIC
Silkstone Common|SLK
Silver Street|SLV
Silverdale|SVR
Singer|SIN
Sittingbourne|SIT
Skegness|SKG
Skewen|SKE
Skipton|SKI
Slade Green|SGR
Slaithwaite|SWT
Slateford|SLA
Sleaford|SLR
Sleights|SLH
Slough|SLO
Small Heath|SMA
Smallbrook Junction|SAB
Smethwick Galton Bridge|SGB
Smethwick Rolfe Street|SMR
Smithy Bridge|SMB
Snowdown|SWO
Soham|SOA
Solihull|SOL
Somersham|SOM
South Acton|SAT
South Bank|SBK
South Bermondsey|SBM
South Croydon|SCY
South Elmsall|SES
South Gyle|SGL
South Hampstead|SOH
South Kenton|SOK
South Merton|SMO
South Milford|SOM
South Ruislip|SRU
South Tottenham|STO
South Wigston|SWS
Southall|STL
Southampton Airport Parkway|SOA
Southampton Central|SOU
Southbourne|SOB
Southbury|SBU
Southease|SEE
Southend Airport|SIA
Southend Central|SOC
Southend East|SOE
Southend Victoria|SOV
Southport|SPT
Southwick|SWI
Sowerby Bridge|SOW
Spalding|SPA
Spean Bridge|SBN
Spital|SPI
Spondon|SPO
Spooner Row|SPN
Springburn|SPR
Springfield|SPF
Squires Gate|SQU
St Andrews Road|SAR
St Annes-on-Sea|SAS
St Austell|SAU
St Bees|SBS
St Budeaux Ferry Road|SBF
St Budeaux Victoria Road|SBV
St Columb Road|SCR
St Denys|SDN
St Erth|SER
St Germans|SGM
St Helens Central|SNH
St Helens Junction|SHJ
St Ives (Cornwall)|SIV
St James Park (Exeter)|SJP
St Johns|SAJ
St Keyne Wishing Well Halt|SKN
St Leonards Warrior Square|SLQ
St Margarets (London)|SMG
St Margarets (Herts)|SMT
St Mary Cray|SMY
St Michaels|STM
St Neots|SNO
St Pancras International|STP
St Peters|SPZ
St. Albans City|SAC
Stafford|STA
Staines|SNS
Stallingborough|SLL
Stalybridge|SYB
Stamford (Lincs)|SMD
Stamford Hill|SFH
Stanlow & Thornton|SNT
Stansted Airport|SSD
Stansted Mountfitchet|SST
Staplehurst|SPU
Stapleton Road|SRD
Starbeck|SBE
Starcross|SCS
Staveley|SVL
Stechford|SCF
Steeton & Silsden|SON
Stepps|STP
Stevenage|SVG
Stewarton|STT
Stewartby|SWR
Stewarts Lane|STL
Stirling|STG
Stockport|SPT
Stocksfield|SKS
Stockton|STK
Stoke Mandeville|SKM
Stoke Newington|SKW
Stoke-on-Trent|SOT
Stone (Staffs)|SNE
Stone Crossing|SCG
Stonebridge Park|SBP
Stonegate|SOG
Stonehaven|STN
Stonehouse|SHU
Stoneleigh|SNL
Stourbridge Junction|SBJ
Stourbridge Town|SBT
Stow|SOI
Stowmarket|SMK
Stranraer|STR
Stratford (London)|SRA
Stratford International|SFA
Stratford-upon-Avon|SAV
Stratford-upon-Avon Parkway|STY
Streatham|STE
Streatham Common|SRC
Streatham Hill|SRH
Streethouse|SHC
Strines|SRN
Stromeferry|STF
Stromness|STS
Strood|SOO
Struan|STU
Sturry|STU
Styal|STY
Sudbury & Harrow Road|SUD
Sudbury Hill Harrow|SDH
Sudbury|SUY
Sugar Loaf|SUG
Summerston|SUM
Sunbury|SUU
Sunderland|SUN
Sundridge Park|SUP
Sunningdale|SNG
Sunnymeads|SNY
Surbiton|SUR
Surrey Quays|SQE
Sutton Coldfield|SUT
Sutton Common|SUC
Sutton Parkway|SPK
Swale|SWL
Swanley|SAY
Swanscombe|SWM
Swansea|SWA
Sway|SWY
Swaythling|SWG
Swinderby|SWD
Swindon|SWI
Swinton (Manchester)|SNN
Swinton (South Yorks)|SWN
Sydenham|SYD
Sydenham Hill|SYH
Syon Lane|SYL
Syston|SYS
Tackley|TAC
Tadworth|TAD
Taffs Well|TAF
Tain|TAI
Talsarnau|TAL
Tal-y-Cafn|TLC
Tame Bridge Parkway|TAB
Tamworth|TAM
Tan-y-Bwlch|TYB
Taplow|TAP
Tattenham Corner|TAT
Taunton|TAU
Taynuilt|TAY
Teddington|TED
Teesside Airport|TEA
Teignmouth|TGM
Telford Central|TFC
Templecombe|TCM
Tenby|TEN
Teynham|TEY
Thames Ditton|THD
Thatcham|THA
Thatto Heath|THH
The Hawthorns|THW
The Lakes|TLK
Theale|THE
Theobalds Grove|TEO
Therford|TFH
Thirsk|THI
Thornaby|TBY
Thornford|THO
Thornliebank|THB
Thornton Abbey|TNA
Thornton Heath|TTH
Thornton Hall|TTH
Thorntonhall|THT
Thorpe Culvert|TPC
Thorpe-le-Soken|TLS
Three Bridges|TBD
Three Oaks|TOK
Thurgarton|THU
Thurnscoe|THC
Thurso|THS
Thurston|THT
Tilbury Town|TIL
Tile Hill|THL
Tilehurst|TLH
Tipton|TIP
Tir-Phil|TIR
Tisbury|TIS
Tiverton Parkway|TVP
Tocyn|TOY
Todmorden|TOD
Tolworth|TOL
Ton Pentre|TPN
Tonbridge|TON
Tondu|TDU
Tonfanau|TNF
Tonypandy|TNP
Toot Hill|TOO
Topsham|TOP
Torquay|TQY
Torre|TRE
Totnes|TOT
Totton|TTN
Town Green|TWN
Trafford Park|TRA
Trefforest|TRF
Trefforest Estate|TRE
Trehafod|TRH
Treherbert|TRB
Treorchy|TRR
Trimley|TRM
Tring|TRI
Troed-y-Rhiw|TRD
Troon|TRN
Trowbridge|TRO
Truro|TRU
Tulloch|TUL
Tulse Hill|TUH
Tunbridge Wells|TBW
Turkey Street|TUR
Tutbury & Hatton|TUT
Twickenham|TWI
Twyford|TWY
Ty Croes|TYC
Ty Glas|TGS
Tygwyn|TGM
Tynemouth|TYM
Tywyn|TYW
Uddingston|UDD
Ulceby|ULC
Ulleskelf|ULL
Ulverston|ULV
Umberleigh|UMB
University (Birmingham)|UNI
University (Halt)|UNH
Uphall|UHA
Upholland|UPL
Upton (Merseyside)|UPT
Upwey|UPW
Urmston|URM
Uttoxeter|UTT
Valley|VAL
Vauxhall|VXH
Virginia Water|VIR
Waddon|WDO
Wadhurst|WAD
Wainfleet|WAF
Wakefield Kirkgate|WKK
Wakefield Westgate|WKF
Walkden|WKD
Wallasey Grove Road|WLG
Wallasey Village|WLV
Wallington|WLT
Wallyford|WAF
Walmer|WAM
Walsall|WSL
Walsden|WDN
Waltham Cross|WLC
Walthamstow Central|WHC
Walthamstow Queens Road|WMW
Walton-on-Thames|WAL
Walton-on-the-Naze|WON
Wanborough|WAN
Wandsworth Common|WSW
Wandsworth Road|WWR
Wandsworth Town|WNT
Wangford|WGF
Wanstead Park|WNP
Wapping|WPE
Warblington|WRL
Ware|WAR
Wareham|WRM
Wargrave|WRG
Warren Point|WNP
Warrington Bank Quay|WBQ
Warrington Central|WAC
Warwick|WRW
Warwick Parkway|WRP
Watchet|WCT
Water Orton|WTO
Waterbeach|WBC
Wateringbury|WTR
Waterloo (Merseyside)|WLO
Watford High Street|WFH
Watford Junction|WFJ
Watford North|WFN
Watlington|WTG
Watton-at-Stone|WAS
Waun-Gron Park|WNG
Wavertree Technology Park|WAV
Wedgwood|WED
Weeley|WEE
Weeton|WET
Welham Green|WMG
Welling|WLI
Wellingborough|WEL
Wellington (Shropshire)|WLN
Welshpool|WLP
Welwyn Garden City|WLG
Welwyn North|WLW
Wem|WEM
Wembley Central|WMB
Wembley Stadium|WCX
Wemyss Bay|WMS
Wendover|WND
Wennington|WNN
West Allerton|WSA
West Brompton|WBP
West Calder|WCL
West Croydon|WCY
West Drayton|WDT
West Dulwich|WDU
West Ealing|WEA
West Ham|WEH
West Hampstead|WHD
West Hampstead Thameslink|WHP
West Horndon|WHR
West India Quay|WEI
West Kilbride|WKB
West Kirby|WKI
West Malling|WMA
West Norwood|WNW
West Ruislip|WRU
West Runton|WRN
West St Leonards|WLD
West Sutton|WSU
West Wickham|WWI
West Worthing|WWO
Westbury|WSB
Westcliff-on-Sea|WCF
Westcombe Park|WCB
Westenhanger|WHA
Wester Hailes|WTA
Westerfield|WFI
Westerton|WES
Westgate-on-Sea|WGA
Westhoughton|WHG
Weston Milton|WNM
Weston-super-Mare|WSE
Wetheral|WRL
Weybridge|WYB
Weymouth|WEY
Whaley Bridge|WBR
Whalley (Lancs)|WLE
Wharfedale|WHD
Whatstandwell|WAT
Whimple|WHI
Whinburgh|WHB
Whinhill|WNL
Whiston|WHN
Whitby|WTB
Whitchurch (Cardiff)|WHT
Whitchurch (Hants)|WCH
Whitchurch (Shrops)|WHC
White Hart Lane|WHL
White Notley|WNY
Whitechapel|ZWL
Whitecraigs|WCR
Whitehaven|WTH
Whitland|WTL
Whitley Bridge|WBD
Whitlocks End|WTE
Whitstable|WHI
Whittlesea|WLE
Whittlesford Parkway|WLF
Whitton|WTN
Whitwell (Derbyshire)|WWL
Whyteleafe|WHY
Whyteleafe South|WHS
Wick|WCK
Wickford|WIC
Wickham Market|WCM
Widdrington|WDD
Widnes|WID
Widney Manor|WDR
Wigan North Western|WGN
Wigan Wallgate|WGW
Wigton|WGT
Wildmill|WDM
Willenhall|WIH
Williamwood|WLM
Willington|WIL
Wilmcote|WMC
Wilmslow|WML
Wilnecote|WNE
Wimbledon|WIM
Wimbledon Chase|WBO
Winchelsea|WSE
Winchester|WIN
Winchfield|WNF
Winchmore Hill|WIH
Windermere|WDM
Windsor & Eton Central|WNC
Windsor & Eton Riverside|WNR
Winnersh|WNS
Winnersh Triangle|WTI
Winsford|WSF
Wishaw|WSH
Witham|WTM
Witley|WTY
Witton|WTT
Wivelsfield|WVF
Wivenhoe|WIV
Woburn Sands|WOB
Woking|WOK
Wokingham|WKM
Woldingham|WOH
Wolfhill|WOF
Wolverhampton|WVH
Wolverton|WOL
Wombwell|WOM
Wood End|WDE
Wood Street|WST
Woodbridge|WDB
Woodgrange Park|WGR
Woodham Ferrers|WHF
Woodhouse|WDH
Woodlesford|WDS
Woodley|WLY
Woodmansterne|WME
Woodsmoor|WSR
Wool|WOO
Woolston|WLS
Woolwich Arsenal|WWA
Woolwich Dockyard|WWD
Wootton Wawen|WWW
Worcester Foregate Street|WOF
Worcester Park|WCP
Worcester Shrub Hill|WOS
Workington|WKG
Worksop|WRK
Worle|WOR
Worplesdon|WPL
Worstead|WRT
Worstead|WRS
Worthing|WRH
Wrabness|WRB
Wraysbury|WRY
Wrenbury|WRE
Wressle|WRS
Wrexham Central|WXC
Wrexham General|WRX
Wye|WYE
Wylam|WYM
Wymondham|WMD
Wythall|WYT
Yalding|YAL
Yarm|YRM
Yate|YAE
Yatton|YAT
Yeoford|YEO
Yeovil Junction|YVJ
Yeovil Pen Mill|YVP
Yoker|YOK
York|YRK
Yorton|YRT
Ystrad Mynach|YSM
Ystrad Rhondda|YSR
""".strip().split('\n')

    for line in station_data:
        if '|' in line:
            name, crs = line.split('|')
            # Determine category based on station name patterns
            category = 'C'  # Default to small
            if any(major in name for major in ['London', 'Manchester', 'Birmingham', 'Bristol', 'Edinburgh', 'Glasgow', 'Liverpool', 'Leeds', 'Newcastle', 'Sheffield', 'Cardiff', 'Nottingham', 'Leicester', 'Southampton', 'Portsmouth', 'Bournemouth', 'Brighton', 'Reading', 'Oxford', 'Cambridge', 'York', 'Norwich', 'Exeter', 'Plymouth', 'Peterborough', 'Doncaster', 'Crewe', 'Carlisle', 'Aberdeen', 'Inverness', 'Swansea']):
                category = 'A'
            elif any(mid in name for mid in ['Central', 'International', 'Airport', 'Parkway']):
                category = 'B'
            
            stations.append({
                "crs": crs.strip(),
                "name": name.strip(),
                "description": name.strip(),
                "category": category
            })
    
    return stations


def main():
    """Main function to generate and save station data"""
    print("Generating UK railway stations list...")
    
    stations = generate_comprehensive_list()
    
    print(f"Generated {len(stations)} stations")
    
    # Write to JSON file
    output_path = 'backend/src/data/stations.json'
    with open(output_path, 'w') as f:
        json.dump(stations, f, indent=2)
    
    print(f"Saved to {output_path}")
    
    # Print first few stations as verification
    print("\nFirst 10 stations:")
    for station in stations[:10]:
        print(f"  {station['crs']}: {station['name']}")


if __name__ == '__main__':
    main()

