package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.*;
import cz.muni.fi.thesis.lalikova.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Set;

@Component
@Transactional
public class TestData
{

    final static Logger log = LoggerFactory.getLogger(TestData.class);

    @Autowired
    private PointDao pointDao;

    @Autowired
    private RouteDao routeDao;

    @Autowired
    private PhotoDao photoDao;

    @Autowired
    private PointTagDao pointTagDao;

    @Autowired
    private CoordinatesDao coordinatesDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private DistancesDao distancesDao;

    public void loadData() throws IOException {

        Route route1 = createRoute("Trasa č.1", "Památkový okruh dlouhý", true);
        Route route2 = createRoute("Trasa č.2", "Památkový okruh krátky", false);
        Route route3 = createRoute("Trasa č.3", "Památkový okruh výběr", false);

        Point point1 = createPoint("Špilberk", "Špilberk (německy Spielberg, v hantecu Špilas) je hrad a pevnost tvořící dominantu města Brna. Nachází se na vrcholu stejnojmenného kopce, který leží v městské části Brno-střed, na západě katastrálního území Město Brno.\n" +
                        "\n" +
                        "Hrad byl založen ve druhé polovině 13. století moravským markrabětem (a později i českým králem) Přemyslem Otakarem II. a během staletí procházel mnoha výraznými proměnami. Z předního královského hradu na Moravě, vystavěného v gotickém slohu, se ve druhé polovině 17. století stala mohutná barokní pevnost, která byla několikrát bez úspěchu obléhána. Její kasematy byly na konci 18. století upraveny na obávanou věznici. V roce 1962 byl hrad společně s okolním parkem prohlášen národní kulturní památkou. V současnosti patří k objektům Muzea města Brna, které zde sídlí. " +
                        "\n" +
                        "Hrad byl založen v polovině 13. století na skalnatém vrchu nad historickým centrem města Brna. Jeho zřizovatel, moravský markrabě a český král Přemysl Otakar II., jej koncipoval jako oporu panovnické moci a důstojné sídlo vládců Moravy. Nejstarší písemné záznamy o hradu pocházejí z let 1277–1279. Název získal z původního pojmenování kopce.\n" +
                        "\n" +
                        "zdroj: wikipedie",
                Set.of(route1, route2));

        Point point2 = createPoint("Moravské náměstí", "Moravské náměstí je veřejné prostranství v centru brněnské městské části Brno-střed, rozkládající se na severovýchodním okraji katastrálního území Město Brno. Jeho severní část zabírají dva parky, oddělené tramvajovou a silniční komunikací. Ve východnějším z nich se nachází monumentální pomník „Vítězství Rudé armády nad fašismem“ od sochaře Vincence Makovského. Cesty západnějšího parku se paprskovitě sbíhají k centrální fontáně. V jižní části Moravského náměstí stojí kostel svatého Tomáše s přilehlým areálem augustiniánského kláštera. Dlážděné náměstí spolu s ním uzavírá z jihu blok budovy DOPZ s kinem Scala a od západu sídlo Nejvyššího správního soudu. " +
                        "\n" +
                        "Původně se zde nacházelo opevnění středověkého města, jedno z nejmohutnějších na Moravě. To drželo dnešní jižní část náměstí s kostelem sv. Tomáše a augustiniánským klášterem uvnitř hradeb, zatímco rozsáhlé severní plochy parku vznikly až jeho zbouráním.\n" +
                        "\n" +
                        "Kostel svatého Tomáše pochází ze 14. století, kdy jej založil Jan Jindřich společně s augustiniánským klášterem. Dokončené kněžiště bylo posvěceno 13. března 1356, současná barokní podoba kostela pochází ze 17. století. Přilehlou budovu Místodržitelského paláce, která byla do barokní podoby přestavěna ve 30. letech 18. století, využívaly po vystěhování kláštera Josefem II. od roku 1783 zemské úřady. " +
                        "\n" +
                        "V letech 2009–2010 probíhala celková rekonstrukce jižní části náměstí před Místodržitelským palácem a kostelem sv. Tomáše. Autorem projektu byl Petr Hrůša spolu s Lukášem Peckou a Vítem Zenklem z Ateliéru Brno. Po opravě bylo předáno veřejnosti 15. září 2010. Bylo zde zrušeno dosavadní parkoviště, dlažba byla rozdělena do geometrického rastru a podobně byl rozmístěn i mobiliář. Do prostoru pak byly rozmístěny prvky zpodobňující čtyři Platónovy ctnosti, které by město mělo mít: umírněnost, moudrost, spravedlnost a statečnost." +
                        "\n" +
                        "zdroj: wikipedie",
                Set.of(route1));

        Point point3 = createPoint("Katedrála svatých Petra a Pavla", "Katedrála svatého Petra a Pavla (zkráceně Petrov) je sídelním kostelem biskupa brněnské diecéze. Nachází se v Brně na vrchu Petrov v městské části Brno-střed v jihozápadní části katastrálního území Město Brno. Je národní kulturní památkou, patří k nejvýznamnějším architektonickým památkám jižní Moravy a také mezi nejvýraznější brněnské dominanty (mj. je vyobrazena na české desetikoruně). Obě věže jsou vysoké 84 metrů, interiér lodi a vnitřní zařízení je převážně barokní od sochaře Ondřeje Schweigla.\n" +
                        "\n" +
                        "Současná vnější silueta se dvěma věžemi vznikla podle návrhu architekta Augusta Kirsteina, který vzešel jako vítězný z architektonické soutěže v roce 1901. Na jeho základě byl chrám přestavěn 1904–1909 ve stylu novogotiky. " +
                        "\n" +
                        "Počátky dnešní katedrály sahají až do 11.–12. století, kdy byla na jejím místě zbudována románská kaple. Na konci 12. století zde pak za vlády markraběte Konráda II. Oty vznikl kostelík, který měl vlastní apsidu i kryptu. Na konci 13. století došlo k další přestavbě na pravděpodobně románskou baziliku, jejíž pozůstatky byly objeveny během archeologického výzkumu katedrály na začátku 21. století a jsou nyní přístupné i veřejnosti. Chrám byl poté přestavěn do raně gotické podoby a dochází i ke vzestupu jeho důležitosti, když se stává proboštským kostelem a také kolegiátní kapitulou. Kostel byl také několikrát vážně poškozen, především v době třicetileté války. Interiér chrámu byl během 18. století poměrně silně barokizován architektem Mořicem Grimmem, což se projevilo především na bočních oltářích, na přestavbě hlavního a také na odstranění značné části gotických prvků z interiéru. Přestavbu provedl významný brněnský stavitel František Benedikt Klíčník. Roku 1777 byl kostel prohlášen katedrálou. U barokizace se však vývoj katedrály nezastavil, jelikož byla v letech 1879–1891 dále architektonicky upravována. V této době došlo k novo-gotizující rekonstrukci presbytáře kaple Panny Marie a také sakristie. Podoba dnešního hlavního oltáře pochází z konce 19. století, když byl předešlý barokní nahrazen dnešním 11 m vysokým pseudo-gotickým dřevěným oltářem od vídeňského řezbáře Josefa Leimera z roku 1891, který znázorňuje ukřižování Krista, na jehož spodní části je vyobrazeno všech dvanáct apoštolů. Po vnější straně katedrály se nachází náhrobky brněnských biskupů Václava Urbana Stufflera a Vincence Josefa Schrattenbacha a také několika patricijských rodin. Po levé straně směrem od hlavního vchodu se nachází vnější kazatelna, tzv. „Kapistránka“, pojmenovaná podle františkánského řádového bratra Jana Kapistrána, který v Brně kázal ve druhé polovině roku 1451. Tato kazatelna mu však nesloužila, vznikla až v pozdější době jako připomenutí jeho osoby. " +
                        "\n" +
                        "zdroj: wikipedie",
                Set.of(route1));

        Point point4 = createPoint("Anthropos", "Pavilon Anthropos (ze starořeckého ὁ ἄνθρωπος = člověk) je součást Moravského zemského muzea v Brně.\n" +
                        "Nachází se na pravém břehu řeky Svratky v nejzápadnější části brněnské městské části Brno-střed v katastrálním území Pisárky. Jeho součástí je stálá expozice o nejstarších dějinách osídlení Moravy a Evropy, tvořená třemi částmi, kromě toho jsou v dalších prostorách pavilonu průběžně instalovány krátkodobé výstavy. \n" +
                        "Počátky Pavilonu Anthropos spadají do období mezi dvěma válkami. V rámci výstavy soudobé kultury v roce 1928 na dnešním výstavišti v samostatném pavilonu „Člověk a jeho rod“ soustředil prof. Karel Absolon nálezy z nejstaršího období vývoje člověka a poutavým způsobem je prezentoval (již tehdy zde byl vystaven model mamuta v životní velikosti). Vznik výstavy podporovali první prezident ČSR Tomáš Garrigue Masaryk i průmyslník Tomáš Baťa.\n" +
                        "\n" +
                        "V důsledku 2. světové války i událostí po ní výstava zanikla, z jejích tradic však vyšel v poválečném období antropolog světového jména Jan Jelínek, ředitel Moravského zemského muzea. Dokázal prosadit stavbu samostatné budovy, pro niž získal místo nedaleko původního pavilonu, v krásném prostředí za Brněnským výstavištěm na druhém břehu Svratky. Stavba Pavilonu Anthropos podle plánů architekta Evžena Šteflíčka byla dokončena v roce 1962 a instalována zde výstava o počátcích vývoje člověka.\n" +
                        "zdroj: wikipedie ",
                Set.of(route1, route2));

        Point point5 = createPoint("Hvězdárna a planetárium Brno", "Hvězdárna a planetárium Brno je příspěvková organizace statutárního města Brna,[1] jejíž historie sahá do 50. let 20. století. Tato kulturně-vzdělávací instituce, která v sobě spojuje hvězdárnu a planetárium, zprovozněné v roce 1954, sídlí v areálu uprostřed parku na kopci Kraví hora na severozápadě městské části Brno-střed v nadmořské výšce 305 m n. m. Vrchol kopule planetária, který se nachází v nadmořské výšce 318 m n. m., je nejvýše položeným bodem v okruhu několika kilometrů.[2] Ředitelem Hvězdárny a planetária Brno je od roku 2008 Jiří Dušek. \n" +
                        "Před otevřením byla hvězdárna označována jako Gottwaldova lidová hvězdárna v Brně, v letech 1954–1965 nesla název Oblastní lidová hvězdárna v Brně, v letech 1965–1970 Lidová hvězdárna a planetárium v Brně, v letech 1970–1973 Hvězdárna a planetárium v Brně a od 19. dubna 1973 do konce listopadu 2010 Hvězdárna a planetárium Mikuláše Koperníka v Brně.[6]\n" +
                        "\n" +
                        "Dne 5. října 2010 schválilo Zastupitelstvo města Brna v souvislosti s modernizací hvězdárny s účinností od 1. prosince 2010[6] nový název Hvězdárna a planetárium Brno. Ředitel hvězdárny vypuštění Koperníkova jména zdůvodnil tím, že Koperník „na rozdíl od řady jiných vědců nikdy v Brně nebyl a neměl s městem nic společného“ a jeho jméno se do názvu údajně dostalo proto, že jinak hrozilo pojmenování po Valentině Těreškovové. Přejmenování má zdůraznit orientaci na současnost a budoucnost. Proti přejmenování vznesli námitky zastupitelé za KSČM (Ladislav Býček) či Stranu zelených (Mojmír Vlašín).[7] Koperníkovo jméno dostala hvězdárna v roce 1973 u příležitosti 500. výročí jeho narození.[6] \n" +
                        "Hvězdárna se nachází při západním okraji čtvrtě Veveří, na vrcholu kopce Kraví hora. Její stavba byla zahájena prvním výkopem 30. srpna 1948.[8] Nejstarší část areálu tvoří dvojice samostatných kopulí o průměru sedm metrů, které byly dostavěny roku 1953 a veřejnosti zpřístupněny 16. října 1954.[6] Severní kopule byla od svého vzniku dlouhodobě ve vlastnictví Masarykovy univerzity. Prvním ředitelem se stal Oto Obůrka, jenž se na vybudování hvězdárny podílel. Na podzim roku 1959 byla otevřena budova s přednáškovým sálem a malým projekčním planetáriem ZKP-1. V říjnu 1991 bylo do provozu uvedeno velké projekční planetárium Spacemaster. V posledních letech na hvězdárnu každoročně přichází více než 100 tisíc návštěvníků, za necelých 60 let její existence jich bylo celkově přes tři miliony.\n" +
                        "\n" +
                        "V letech 2010 a 2011 byl areál za 97 milionů Kč (32 milionů Kč z rozpočtu města, 65 milionů Kč z fondů Evropské unie)[9] zrekonstruován a rozšířen podle návrhu architekta Martina Rudiše v rámci projektu „Přírodovědné exploratorium“.[6] Přestavba byla zahájena na konci srpna 2010,[10] areál byl znovu otevřen 12. listopadu 2011.[9] Po modernizaci hvězdárna rozšířila svou činnosti i na ostatní přírodní vědy (především z neživé přírody).[7]\n" +
                        "\n" +
                        "V roce 2020 odkoupilo město Brno od Masarykovy univerzity její univerzitní observatoř (severní samostatnou kopuli) a začlenilo ji do areálu a správy Hvězdárny a planetária Brno.[11] \n" +
                        "zdroj: wikipedie",
                Set.of(route2));

        Point point6 = createPoint("Wilsonův les", "Wilsonův les je lesopark o přibližné rozloze 34,4 hektarů, rozkládající se převážně na jižním okraji městské části Brno-Žabovřesky; jižním cípem však zasahuje i na území sousední městské části Brno-střed. Lesopark se rozkládá na skalnatém východním a severovýchodním svahu Žlutého kopce, na levém břehu řeky Svratky, v katastrálních územích Stránice, Pisárky a Žabovřesky. \n" +
                        "Lesopark byl založen roku 1882 velkostatkářem a notářem rakouského a rakousko-uherského císaře Františka Josefa I., Ludvíkem Odstrčilem v těsném sousedství tehdejší osady Kamenný Mlýn na jihu tehdejšího katastru obce Žabovřesky. Díky Odstrčilově spolupráci se Žabovřeskami a Zalesňovacím a okrašlovacím spolkem Brna vznikl lesopark o dnešní výměře skoro 34 ha. Svého času se na jeho okraji, za dnešním Biskupským gymnáziem, nacházel i jehlan, připomínající císaře Františka Josefa I. Z douglasek byla na severní straně vysázena písmena FJE (František Josef, Elizabetha), viditelná z protějších kopců a údolí. \n" +
                        "Součástí Wilsonova lesa je na úpatí svahu sportovní areál Pod lesem s historickou restaurací Rosnička a stejnojmennou víceúčelovou sportovní halou (z přelomu 80. a 90. let 20. století, známa zejména basketbalovou ligou). Na počátku 70. let 20. století byl v lese vysekán průsek a zřízena lyžařská sjezdovka s umělým povrchem. Později však byla uvedena mimo provoz a chátrala. Počátkem 21. století vznikl plán na obnovu sjezdovky, proti kterému se postavila řada obyvatel Žabovřesk včetně občanského sdružení Wilsonův les. V roce 2007 ze záměru sešlo a o rok později bylo rozhodnuto průsek začlenit do lesoparku,[1][2] k čemuž došlo v roce 2010. Na následující rok je plánována celková revitalizace parku s finanční podporou evropských fondů.[3]\n" +
                        "zdroj: wikipedie",
                Set.of(route1));

        Coordinates coordinates1 = createCoordinates(16.599211022817716, 49.19458262392775, point1);
        Coordinates coordinates2 = createCoordinates(16.606823348960095, 49.19912148092236, point2);
        Coordinates coordinates3 = createCoordinates(16.60763874071133, 49.191219940789175, point3);
        Coordinates coordinates4 = createCoordinates(16.566847708531117, 49.19277300502827, point4);
        Coordinates coordinates5 = createCoordinates(16.584006152531803, 49.20562103817422, point5);
        Coordinates coordinates6 = createCoordinates(16.573105656129453, 49.20399477365569, point6);

        Photo photo1_1 = createPhoto("Hrad Špilberk", "images/spilberk_1.jpg", point1);
        Photo photo1_2 = createPhoto("Park Špilberk", "images/spilberk_2.jpg", point1);
        Photo photo1_3 = createPhoto("Špilberk - pohled z výšky", "images/spilberk_3.jpg", point1);
        Photo photo1_4 = createPhoto("Vchod na první nádvoří", "images/spilberk_4.jpg", point1);
        Photo photo1_5 = createPhoto("Letecký pohled na hrad", "images/spilberk_5.jpg", point1);

        Photo photo2_1 = createPhoto("Pohled od fontány na náměstí směrem na jih, ke kostelu sv. Tomáše", "images/moravak_1.jpg", point2);
        Photo photo2_2 = createPhoto("Model Brna z r. 1645 v jižní části náměstí", "images/moravak_2.jpg", point2);
        Photo photo2_3 = createPhoto("Pomník rudoarmejce na paměť osvobození Brna (26. dubna 1945)", "images/moravak_3.jpg", point2);

        Photo photo3_1 = createPhoto("Katedrála svatého Petra a Pavla", "images/petrov_1.jpg", point3);
        Photo photo3_2 = createPhoto("Gotická klenba v presbytáři ", "images/petrov_2.jpg", point3);
        Photo photo3_3 = createPhoto("Interiér katedrály", "images/petrov_3.jpg", point3);
        Photo photo3_4 = createPhoto("Oltář v katedrále", "images/petrov_4.jpg", point3);
        Photo photo3_5 = createPhoto("Noční pohled na katedrálu od kostela Nalezení svatého kříže", "images/petrov_5.jpg", point3);
        Photo photo3_6 = createPhoto("Pohled na katedrálu z věže Staré radnice", "images/petrov_6.jpg", point3);

        Photo photo4_1 = createPhoto("Pavilon Anthropos", "images/anthropos_1.jpg", point4);
        Photo photo4_2 = createPhoto("Jižní průčelí pavilonu", "images/anthropos_2.jpg", point4);
        Photo photo4_3 = createPhoto("Model mamuta s mládětem v životní velikosti v muzeu Anthropos", "images/anthropos_3.jpg", point4);

        Photo photo5_1 = createPhoto("Budova Hvězdárny a planetária Brno na Kraví hoře v Brně", "images/kravak_1.jpg", point5);
        Photo photo5_2 = createPhoto("Letecký snímek areálu Hvězdárny a planetária Brno na Kraví hoře", "images/kravak_2.jpg", point5);
        Photo photo5_3 = createPhoto("Základní kámen velkého planetária, dnes sluneční hodiny", "images/kravak_3.jpg", point5);
        Photo photo5_4 = createPhoto("Interiér budovy", "images/kravak_4.jpg", point5);

        Photo photo6_1 = createPhoto("Část lesoparku Wilsonův les náležející do katastru brněnské městské části Brno-Žabovřesky", "images/les_1.jpg", point6);
        Photo photo6_2 = createPhoto("Cesta lesem", "images/les_2.jpg", point6);
        Photo photo6_3 = createPhoto("Výhled na Žabovřesky a Komín překrytý porostem", "images/les_3.jpg", point6);
        Photo photo6_4 = createPhoto("Historická restaurace Rosnička", "images/les_4.jpg", point6);

        PointTag pointTag1 = createPointTag("Church", "Church point", Set.of(point3));
        PointTag pointTag2 = createPointTag("Architecture", "Architectural point", Set.of(point1, point2, point3, point4, point5));
        PointTag pointTag3 = createPointTag("Nature", "Natural point", Set.of(point2, point4, point5, point6));

        PasswordEncoder encoder = new Argon2PasswordEncoder();
        User authenticatedUser = new User();
        authenticatedUser.setLogin("user");
        authenticatedUser.setPasswordHash("user");
        log.error("Create user pswd hash: " + encoder.encode("user"));
        log.error("Create user get pswd hash: " + authenticatedUser.getPasswordHash());
        userDao.create(authenticatedUser);

        // Measured using bananas per meter.
        long[][] distance_data = {
            { 1,2,269 },
            { 1,4,306 },
            { 1,3,298 },
            { 1,5,399 },
            { 2,3,178 },
            { 1,6,285 },
            { 2,1,232 },
            { 3,5,516 },
            { 2,4,374 },
            { 3,4,525 },
            { 2,6,353 },
            { 4,5,397 },
            { 4,3,473 },
            { 2,5,339 },
            { 3,1,344 },
            { 5,1,365 },
            { 3,6,466 },
            { 4,1,289 },
            { 3,2,238 },
            { 4,6,288 },
            { 5,2,318 },
            { 4,2,533 },
            { 5,4,425 },
            { 6,5,226 },
            { 5,6,224 },
            { 6,2,378 },
            { 6,1,272 },
            { 6,4,271 },
            { 6,3,406 },
            { 5,3,422 }
        };

        for (long[] item : distance_data) {
            createDistances(item[0], item[1], (double) item[2]);
        }
    }
    private Coordinates createCoordinates(double longitude, double latitude, Point point){
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(latitude);
        coordinates.setLongitude(longitude);
        coordinates.setPoint(point);
        coordinatesDao.create(coordinates);
        return coordinates;
    }

    private Photo createPhoto(String desc, String url, Point point){
        Photo photo = new Photo();
        photo.setDescription(desc);
        photo.setImage(url);
        photo.setPoint(point);
        photoDao.create(photo);
        return photo;
    }

    private PointTag createPointTag(String title, String desc, Set<Point> points ){
        PointTag pointTag = new PointTag();
        pointTag.setDescription(desc);
        pointTag.setName(title);
        pointTag.setPoints(points);
        pointTagDao.create(pointTag);
        return pointTag;
    }

    private Point createPoint(String title, String desc, Set<Route> routes){
        Point point = new Point();
        point.setDescription(desc);
        point.setTitle(title);
        point.setRoutes(routes);
        pointDao.create(point);
        return point;
    }

    private Route createRoute(String title, String desc, Boolean difficult) {
        Route route = new Route();
        route.setTitle(title);
        route.setDescription(desc);
        route.setDifficult(difficult);
        routeDao.create(route);
        return route;
    }

    private Distances createDistances(Long idA, Long idB, Double distance) {
        Distances distances = new Distances();
        distances.setPointAId(idA);
        distances.setPointBId(idB);
        distances.setDistance(distance);
        distancesDao.create(distances);
        return distances;
    }
}
