<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Institute APEX Jind</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #1e293b;
            background: #f8fafc;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            padding: 32px;
            border: 1px solid #e2e8f0;
          }
          h1 {
            color: #06101e;
            font-size: 1.6rem;
            margin: 0 0 8px 0;
            font-weight: 800;
          }
          p {
            color: #64748b;
            font-size: 0.95rem;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
          }
          th {
            background: #0b1f3a;
            color: #ffffff;
            text-align: left;
            padding: 12px 14px;
            font-weight: 600;
          }
          th:first-child { border-top-left-radius: 6px; }
          th:last-child { border-top-right-radius: 6px; }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #e2e8f0;
          }
          tr:hover td {
            background: #f1f5f9;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority-badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.78rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Institute APEX — XML Sitemap</h1>
          <p>This is the search engine index manifest for <strong>https://instituteapex.in</strong>. Search bots use this document to discover and rank official institute pages.</p>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="priority-badge">
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
