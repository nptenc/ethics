$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$Downloads = Join-Path $HOME "Downloads"
$Target    = "images\services\cards"
$HtmlFile  = "sections\services.html"

New-Item -ItemType Directory -Force $Target | Out-Null


# =========================================================
# SERVICE DEFINITIONS
# =========================================================

$Services = @(

    @{
        Title = "General Security Guard"
        Key   = "general-security"
        Alt   = "General security guard service"
    },

    @{
        Title = "Armed Guard & Gunman"
        Key   = "armed-security"
        Alt   = "Armed guard and gunman security service"
    },

    @{
        Title = "VIP & Close Protection"
        Key   = "vip-protection"
        Alt   = "VIP and close protection service"
    },

    @{
        Title = "Event Security Management"
        Key   = "event-security"
        Alt   = "Event security management"
    },

    @{
        Title = "Housekeeping & Support Staff"
        Key   = "housekeeping-support"
        Alt   = "Housekeeping and support staff service"
    },

    @{
        Title = "Industrial Manpower"
        Key   = "industrial-manpower"
        Alt   = "Industrial manpower service"
    }

)


# =========================================================
# RESIZE FUNCTION
# =========================================================

function Resize-Png {

    param(
        [string]$Path,
        [int]$Width,
        [int]$Height
    )

    $Source = [System.Drawing.Image]::FromFile(
        (Resolve-Path $Path).Path
    )

    if (
        $Source.Width -eq $Width -and
        $Source.Height -eq $Height
    ) {
        $Source.Dispose()
        return
    }

    $Bitmap = New-Object System.Drawing.Bitmap(
        $Width,
        $Height
    )

    $Graphics = [System.Drawing.Graphics]::FromImage(
        $Bitmap
    )

    $Graphics.InterpolationMode =
        [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $Graphics.CompositingQuality =
        [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $Graphics.SmoothingMode =
        [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $Graphics.DrawImage(
        $Source,
        0,
        0,
        $Width,
        $Height
    )

    $Temp = "$Path.tmp.png"

    $Bitmap.Save(
        $Temp,
        [System.Drawing.Imaging.ImageFormat]::Png
    )

    $Graphics.Dispose()
    $Bitmap.Dispose()
    $Source.Dispose()

    Move-Item $Temp $Path -Force
}


# =========================================================
# COPY ALL 12 EXACT DOWNLOAD FILES AGAIN
# =========================================================

Write-Host ""
Write-Host "===== INSTALLING 12 FINAL PHOTOS =====" -ForegroundColor Cyan

foreach ($Service in $Services) {

    $DesktopName =
        "$($Service.Key)-desktop.png"

    $MobileName =
        "$($Service.Key)-mobile.png"


    $DesktopSource =
        Join-Path $Downloads $DesktopName

    $MobileSource =
        Join-Path $Downloads $MobileName


    if (-not (Test-Path $DesktopSource)) {
        throw "Missing Downloads file: $DesktopName"
    }

    if (-not (Test-Path $MobileSource)) {
        throw "Missing Downloads file: $MobileName"
    }


    $DesktopTarget =
        Join-Path $Target $DesktopName

    $MobileTarget =
        Join-Path $Target $MobileName


    Copy-Item $DesktopSource $DesktopTarget -Force
    Copy-Item $MobileSource  $MobileTarget  -Force


    Resize-Png $DesktopTarget 1200 675
    Resize-Png $MobileTarget  1080 1350


    Write-Host "OK:" $Service.Key -ForegroundColor Green
}


# =========================================================
# CHECK WHETHER FILE CONTENT IS ACTUALLY UNIQUE
# =========================================================

Write-Host ""
Write-Host "===== DESKTOP IMAGE HASHES =====" -ForegroundColor Cyan

$DesktopFiles =
    Get-ChildItem "$Target\*-desktop.png"

$DesktopHashes =
    $DesktopFiles |
    Get-FileHash -Algorithm SHA256

$DesktopHashes |
Select-Object Path,Hash |
Format-Table -AutoSize


$DesktopUnique =
    @(
        $DesktopHashes.Hash |
        Select-Object -Unique
    ).Count


Write-Host ""
Write-Host "Unique desktop photos:" $DesktopUnique "/ 6"


Write-Host ""
Write-Host "===== MOBILE IMAGE HASHES =====" -ForegroundColor Cyan

$MobileFiles =
    Get-ChildItem "$Target\*-mobile.png"

$MobileHashes =
    $MobileFiles |
    Get-FileHash -Algorithm SHA256

$MobileHashes |
Select-Object Path,Hash |
Format-Table -AutoSize


$MobileUnique =
    @(
        $MobileHashes.Hash |
        Select-Object -Unique
    ).Count


Write-Host ""
Write-Host "Unique mobile photos:" $MobileUnique "/ 6"


# =========================================================
# FIX EACH SERVICE CARD HTML BY SERVICE NAME
# =========================================================

Write-Host ""
Write-Host "===== REBUILD SERVICE IMAGE REFERENCES =====" -ForegroundColor Cyan

$Html = Get-Content $HtmlFile -Raw

foreach ($Service in $Services) {

    $TitlePattern =
        [regex]::Escape(
            $Service.Title
        )


    $CardPattern =
        '(?is)<article\s+class="ess-service-card"[^>]*>' +
        '.*?' +
        '<h3[^>]*>\s*' +
        $TitlePattern +
        '\s*</h3>' +
        '.*?' +
        '</article>'


    $Match =
        [regex]::Match(
            $Html,
            $CardPattern
        )


    if (-not $Match.Success) {

        throw "Could not find card: $($Service.Title)"

    }


    $Card = $Match.Value


    # Remove existing service photo
    $Card = [regex]::Replace(
        $Card,
        '(?is)\s*<div\s+class="ess-service-card-photo"[^>]*>.*?</div>\s*',
        "`r`n",
        1
    )


    $Photo = @"

<div
  class="ess-service-card-photo"
  data-service="$($Service.Key)"
>
  <picture>

    <source
      media="(max-width: 767.98px)"
      srcset="images/services/cards/$($Service.Key)-mobile.png?v=service-final6"
    >

    <img
      src="images/services/cards/$($Service.Key)-desktop.png?v=service-final6"
      alt="$($Service.Alt)"
      loading="lazy"
    >

  </picture>
</div>

"@


    $Card =
        [regex]::Replace(
            $Card,
            '(?is)(<article\s+class="ess-service-card"[^>]*>)',
            '$1' + "`r`n" + $Photo,
            1
        )


    $Html =
        $Html.Substring(
            0,
            $Match.Index
        ) +
        $Card +
        $Html.Substring(
            $Match.Index +
            $Match.Length
        )


    Write-Host "LINKED:" $Service.Key -ForegroundColor Green
}


Set-Content `
    -Encoding UTF8 `
    $HtmlFile `
    $Html


# =========================================================
# FINAL REFERENCE CHECK
# =========================================================

Write-Host ""
Write-Host "===== FINAL SERVICE REFERENCES =====" -ForegroundColor Cyan

foreach ($Service in $Services) {

    $DesktopRef =
        "$($Service.Key)-desktop.png"

    $Count =
        (
            Select-String `
                $HtmlFile `
                -Pattern ([regex]::Escape($DesktopRef)) `
                -AllMatches
        ).Matches.Count


    Write-Host (
        "{0,-26} {1}" -f
        $Service.Key,
        $Count
    )
}


Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan

if (
    $DesktopUnique -eq 6 -and
    $MobileUnique -eq 6
) {

    Write-Host " SERVICE_IMAGES=PASS" -ForegroundColor Green
    Write-Host " All 6 desktop and 6 mobile photos are unique." -ForegroundColor Green

}
else {

    Write-Host " SERVICE_IMAGES=DUPLICATE_FILES" -ForegroundColor Red
    Write-Host ""
    Write-Host "The HTML is fixed, but some downloaded photos contain identical image data." -ForegroundColor Yellow
    Write-Host "Desktop unique: $DesktopUnique / 6" -ForegroundColor Yellow
    Write-Host "Mobile unique : $MobileUnique / 6" -ForegroundColor Yellow
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

