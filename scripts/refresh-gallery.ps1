$ErrorActionPreference = "Stop"

# =========================================================
# ETHICS SECURITY SERVICE
# GALLERY JSON GENERATOR - FINAL FIX
# =========================================================

$GalleryFolder = [System.IO.Path]::GetFullPath(
    (Join-Path $PSScriptRoot "..\images\gallery")
)

$OutputFile = [System.IO.Path]::GetFullPath(
    (Join-Path $PSScriptRoot "..\data\gallery.json")
)

$AllowedExtensions = @(
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
)

$CategoryLabels = @{
    "work"       = "Work Photos"
    "industrial" = "Industrial Security"
    "training"   = "Training & Readiness"
    "event"      = "Event Security"
    "vip"        = "VIP Protection"
    "team"       = "Security Personnel"
    "site"       = "Site Operations"
}


Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " ETHICS GALLERY REFRESH - FINAL" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Gallery root:" $GalleryFolder
Write-Host ""


# =========================================================
# FIND ALL REAL PHOTOS
# =========================================================

$Files = @(
    Get-ChildItem `
        -Path $GalleryFolder `
        -Recurse `
        -File |
    Where-Object {
        $_.Extension.ToLower() -in $AllowedExtensions
    } |
    Sort-Object `
        LastWriteTime `
        -Descending
)


$Items = @()


foreach ($File in $Files) {

    # -----------------------------------------------------
    # CORRECT RELATIVE PATH
    # -----------------------------------------------------

    $RelativePath = $File.FullName.Substring(
        $GalleryFolder.Length
    )

    $RelativePath = $RelativePath.TrimStart(
        [char[]]@('\','/')
    )

    $WebPath = $RelativePath.Replace(
        '\',
        '/'
    )


    # -----------------------------------------------------
    # CATEGORY = FIRST SUBFOLDER
    # Example:
    # site\photo.png  -> site
    # team\photo.png  -> team
    # -----------------------------------------------------

    $PathParts = $RelativePath -split '[\\/]'

    if ($PathParts.Count -gt 1) {

        $Category = $PathParts[0].ToLower()

    }
    else {

        $Category = "work"

    }


    if (-not $CategoryLabels.ContainsKey($Category)) {

        $Category = "work"

    }


    # -----------------------------------------------------
    # CLEAN DISPLAY TITLE
    # -----------------------------------------------------

    $BaseName = [System.IO.Path]::GetFileNameWithoutExtension(
        $File.Name
    )


    $CleanTitle = $BaseName

    $CleanTitle = $CleanTitle `
        -replace '^ethics[-_ ]+', ''

    $CleanTitle = $CleanTitle `
        -replace '[-_]+', ' '

    $CleanTitle = $CleanTitle `
        -replace '\s+', ' '


    $CleanTitle = (
        Get-Culture
    ).TextInfo.ToTitleCase(
        $CleanTitle.ToLower()
    )


    # -----------------------------------------------------
    # CREATE ITEM
    # -----------------------------------------------------

    $Items += [PSCustomObject]@{

        src =
            "images/gallery/$WebPath"

        title =
            $CleanTitle

        category =
            $Category

        categoryLabel =
            $CategoryLabels[$Category]

        updated =
            $File.LastWriteTime.ToString("yyyy-MM-dd")

    }

}


# =========================================================
# WRITE JSON
# =========================================================

$OutputDirectory = Split-Path $OutputFile -Parent

New-Item `
    -ItemType Directory `
    -Force `
    $OutputDirectory |
Out-Null


if ($Items.Count -eq 0) {

    "[]" |
    Set-Content `
        -Encoding UTF8 `
        $OutputFile

}
else {

    ConvertTo-Json `
        -InputObject @($Items) `
        -Depth 5 |
    Set-Content `
        -Encoding UTF8 `
        $OutputFile

}


# =========================================================
# REPORT
# =========================================================

Write-Host "Photos:" $Items.Count -ForegroundColor Yellow
Write-Host ""


foreach ($Category in @(
    "team",
    "site",
    "industrial",
    "training",
    "event",
    "vip",
    "work"
)) {

    $Count = @(
        $Items |
        Where-Object {
            $_.category -eq $Category
        }
    ).Count


    if ($Count -gt 0) {

        Write-Host (
            "{0,-15} {1}" -f
            $Category,
            $Count
        )

    }

}


Write-Host ""
Write-Host "Output:" $OutputFile
Write-Host ""
Write-Host "GALLERY_REFRESH=PASS" -ForegroundColor Green
Write-Host ""

