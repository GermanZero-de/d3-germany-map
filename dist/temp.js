// This is some copied code from https://ramiro.org/map/deu/foreign-population/
// which might be needed for stuff later

let selector = '#map',
    bbox = d3.select(selector).node().getBoundingClientRect(),
    width = bbox.width,
    height = 1.2 * bbox.width,
    scale = [4.84 * width],
    tr = [-width / 2.7, 4.68 * height],
    map = d3.choropleth().geofile('/d3-geomap/topojson/countries/DEU.json').projection(d3.geoMercator).unitId('fips').column('Foreign Population Percentage').colors(d3.schemeYlOrRd[9]).legend(!0).width(width).height(height).scale(scale).translate(tr).postUpdate(annotate);
d3.csv('/data/deu-foreign-population.csv').then((a) => {
    map.draw(d3.select(selector).datum(a)), table(a, '#table-body', ['State', 'Foreign Population', 'Foreign Population Percentage']), $('.table').DataTable({
        paging: !1,
        searching: !1,
        info: !1
    })
});

function annotate() {
    let a = 60,
        b = map.svg,
        c = 70,
        d = 600,
        e = b.append('g').attr('class', 'footer').attr('width', '100%').attr('height', a).attr('transform', 'translate(0,' + (height - a) + ')');
    e.append('rect').attr('class', 'footer').attr('width', d).attr('height', a).attr('x', c - 2), e.append('text').attr('width', d).attr('x', c + 2).attr('y', 12).text(annotation.desc), e.append('text').attr('width', d).attr('x', c + 2).attr('y', 28).text(annotation.credits)
}

function table(a, b, c) {
    let d = d3.select(b),
        e = d.selectAll('tr').data(a).enter().append('tr'),
        f = e.selectAll('td').data(function(a) {
            return c.map(function(b) {
                var c = a[b],
                    d = 'string';
                return c.match(/^[\d\.]+$/) && (c = parseFloat(c), d = 'is-text-right'), {
                    column: b,
                    value: c,
                    cssclass: d
                }
            })
        }).enter().append('td').attr('class', function(a) {
            return a.cssclass
        }).text(function(a) {
            return a.value
        })
}