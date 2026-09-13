var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Test", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// Add services to the container.

var app = builder.Build();

app.UseCors("Test");

// Configure the HTTP request pipeline.

var cities = new List<City>
{
    new()
    {
        Id = 55,
        CityName = "Lisbon",
        Country = "Portugal",
        Emoji = "🇵🇹",
        Date = DateTime.Parse("2027-10-31T15:59:59.138Z"),
        Notes = "My favorite city so far!",
        Position = new Position
        {
            Lat = 38.727881642324164,
            Lng = -9.140900099907554
        }
    },
    new()
    {
        Id = 56,
        CityName = "Paris",
        Country = "France",
        Emoji = "🇫🇷",
        Date = DateTime.Parse("2027-09-15T12:00:00Z"),
        Notes = "Beautiful city.",
        Position = new Position
        {
            Lat = 48.8566,
            Lng = 2.3522
        }
    }
};

// GET /cities
app.MapGet("/cities", () =>
{
    return Results.Ok(cities);
});


// GET /cities/{id}
app.MapGet("/cities/{id:int}", (int id) =>
{
    var city = cities.FirstOrDefault(c => c.Id == id);

    if (city is null)
        return Results.NotFound();

    return Results.Ok(city);
});


// POST /cities
app.MapPost("/cities", (City city) =>
{
    city.Id = cities.Count + 1;
    city.Date = DateTime.UtcNow;

    cities.Add(city);

    return Results.Created($"/cities/{city.Id}", city);
});


// DELETE /cities/{id}
app.MapDelete("/cities/{id:int}", (int id) =>
{
    var city = cities.FirstOrDefault(c => c.Id == id);

    if (city is null)
        return Results.NotFound();

    cities.Remove(city);

    return Results.NoContent();
});





app.Run();


public class City
{
    public int Id { get; set; }

    public string CityName { get; set; } = "";

    public string Country { get; set; } = "";

    public string Emoji { get; set; } = "";

    public DateTime Date { get; set; }

    public string Notes { get; set; } = "";

    public Position Position { get; set; } = new();
}


public class Position
{
    public double Lat { get; set; }

    public double Lng { get; set; }
}