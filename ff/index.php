<!doctype html>
<html lang="pt">
<head>  
    <title>Filipa Fonseca · Portfolio</title>
    <meta name="description" content="cv filipa fonseca">
    <meta name="author" content="filipa fonseca">
    <meta name="google" value="notranslate">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
    	html, body {
            margin: 20px 0;
            padding: 0;
            background: #111;            
            font-family: 'arial';
            font-size: 12px;
        }

        main {
            width: 90%;
            margin: auto 5%; 
            display: inline-block;
        }

        nav {                
            width: 100%;
            display: inline-block;
            position: fixed;
            top: 0;
            background-color: #111;            
            line-height: 30px;
            height: 30px;
            border-bottom: 1px solid #fff;
        }

        nav a {
            float: right;
            border-left: 1px solid #fff;
            padding: 0 20px;
            text-decoration: none;
            text-transform: uppercase;
            font-weight: 500;
            color: #fff;
            transition: 100ms all ease-in-out;
        }

        nav a.back {
            float: left;
            border-left: 0;
        }

        nav a:hover {
            color: #ddd;
            opacity: 1;
        }

        footer {
            width: 100%;
            color: #aaa;
            font-size: 10px;
            margin: 20px 0;
            text-align: center;
        }
    	
        .projects {
            margin: 0;
            padding: 0;
        }
        .projects li {
            display: inline-block;
            width: 20vw;
            height: 20vw;
            float: left;
            text-align: center;
            margin: 1.2vw;
            position: relative;
            background-color: #eee;
            border-radius: 1px;
            min-width: 200px;
            min-height: 200px; 
            transition: all 100ms ease-in-out;
        }

        .projects li:hover {
            background-color: #fff;
        }

        .projects li a {
            display: inline-block;
        }

        .projects li .image {
            background-position: -100px -80px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 82%;
            opacity: 0.9;            
            transition: all 100ms ease-in-out;
        }

        .projects li:hover .image {
            opacity: 1;
        }
        
        .projects li .name {
            position: absolute;
            top: 88%;
            left: 0;
            width: 100%;
            color: #333;
            font-weight: 600;
        }

        .item  {
            text-align: center;
        }

    </style>
</head>
<body>
    

<?php	
	
	$projects = [
        'BERGCYCLES',
        'BERGOUTDOOR',
        'CROFTPINK',
        'DDL',
        'TAYLORS',
        'YEATMAN',
        'AVELEDA',
        'BO',
        'BOM-BOCADO',
        'CARAS-ANGOLA',
        'COTTON-LOUNGE',
        'CREATIVWINE',
        'DOURO-AZUL',
        'DYRUP',
        'GARLAND',
        'HABITAT-ANIMAL',
        'HERDADEDOSGROUS',
        'HOTEL-STARINN',
        'LACTOGAL',
        'LD',
        'MELIA',
        'MELO-ALVIM',
        'ONWINE',
        'PLV',
        'TURISMO-ALENTEJO',
        'WOCK'
    ];

    sort($projects);

    $get_images = function ($p) {
        $dir = 'projects/'.$p.'/';
        $images = array();        
        if (is_dir($dir)) {
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if ($file != "." && $file != ".." && substr($file, strrpos($file, '.') + 1) == 'jpg') {
                        $images[] = $dir . $file;
                    }            
                }
                closedir($dh);
            }
        }        
        sort($images);
        return $images;
    };

    $p = null;
    if(isset($_GET['p'])) {
        $p = $_GET['p'];    
        $p = strtoupper($p);
    }    
    if (in_array($p, $projects)) {
        $images = $get_images($p);

        $index = array_search($p, $projects);
        $next = $index + 1 < count($projects) ? $index + 1 : 0;
        $prev = $index - 1 > -1 ? $index - 1 : count($projects) - 1;

        echo '<nav><a href="/ff" class="back">Voltar</a>';        
        echo '<a href="/ff?p=' . $projects[$next] . '">Próximo &#8250;</a>';
        echo '<a href="/ff?p=' . $projects[$prev] . '">&#8249; Anterior</a>';
        echo '</nav>';
        echo '<main><br>';
        foreach ($images as $image) {
            echo '<div class="item"><img src="' . $image . '" alt="' . $image . '"/></div>';
        }
        echo '</main>';
    } else {

        echo '<main>';
        echo '<ul class="projects">';
        foreach ($projects as $project) {
            $images = $get_images($project);

            echo '<li><a href="?p=' . strtolower($project) . '">';
            echo '<div class="image" style="background-image: url(' . $images[0] . '); "></div>';
            echo '<div class="name">' . str_replace('-', ' ', $project) . '</div>';
            echo '</a></li>';
        }
        echo '</ul>';
        echo '</main>';
    }
	
		
?>
    </main>

    <footer>
        Nítida Lda &copy; <?php echo date('Y'); ?>
    </footer>
</body>
</html>
  	
