#Visualizing the lives of Olin's email lists
##Dependencies and running the code
If you want to play with the Javascript, the repo is self-contained at the moment; all you need is an internet connection to reach the 
CDN for D3. The web-scraping part requires several outside dependencies:
- [Python 3](https://www.python.org/downloads/release/python-352/)
- [Requests](http://docs.python-requests.org/en/master/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)
- A valid login to every email list you want to analyze

Using the email lists as data brings up privacy concerns. Nothing personally identifiable should leave Olin;
that means data sets with names or email bodies shouldn't be on GitHub. If you have any misgivings, talk to IT.

##Giving credit
The D3 was heavily inspired by Michele Weigle's [scatterplot example](http://bl.ocks.org/weiglemc/6185069). 

The scraping was informed by Ryan Mitchell's book [Web Scraping with Python](http://shop.oreilly.com/product/0636920034391.do)

And of course, I owe it all to stackoverflow. Thank you wonderful question-answering people.
